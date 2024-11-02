<?php

namespace App\Http\Controllers;

use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $logoCICI = asset('CICI.png'); // Genera la URL pública de la imagen
        $users = User::getAllUserRoles();
        $roles = Role::all();
        $usuariosRoles = User::getPermissionAuthUser();
        return Inertia::render('Users/index', [
            'users' => $users,
            'roles' => $roles,
            'usuariosRoles' => $usuariosRoles,
            'logoCICI' => $logoCICI, 
        ]);
    }

    public function store(Request $request)
    {

        $messages = [

            'name.required' => 'El nombre es obligatorio',
            'name.string' => 'El nombre debe ser texto',
            'name.max' => 'El nombre no debe exceder los 255 caracteres',
        
            'email.required' => 'El correo electrónico es obligatorio',
            'email.email' => 'Debe ingresar un correo electrónico válido',
            'email.unique' => 'Este correo electrónico ya está en uso',
        
            'password.required' => 'La contraseña es obligatoria',
            'password.string' => 'La contraseña debe ser texto',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres',
            'password.confirmed' => 'La confirmación de la contraseña no coincide',
        
            'role.required' => 'El rol es obligatorio',
            'role.exists' => 'El rol seleccionado no es válido',
        ];
        
        // Validar los datos del formulario, ahora usando `role` como `role_id`
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|exists:roles,id', // Validar que el rol exista por ID
        ], $messages);

        // Crear un nuevo usuario
        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
        ]);

        // Asignar el rol al usuario usando el ID
        $role = Role::find($validatedData['role']);
        $user->assignRole($role->name); // Asigna el rol usando el nombre del rol

        // Obtener la lista actualizada de usuarios
        $users = User::all();
        $roles = Role::all(); // También obtener los roles

        // Devolver la vista de usuarios con los datos actualizados usando Inertia
        return Inertia::render('Users/index', [
            'users' => $users,
            'roles' => $roles,
            'success' => 'Usuario creado exitosamente.',
        ]);
    }



    public function update(Request $request, User $user)
    {
        //
        $messages = [

            'name.required' => 'El nombre es obligatorio',
            'name.string' => 'El nombre debe ser texto',
            'name.max' => 'El nombre no debe exceder los 255 caracteres',
        
            'email.required' => 'El correo electrónico es obligatorio',
            'email.email' => 'Debe ingresar un correo electrónico válido',
            'email.unique' => 'Este correo electrónico ya está en uso',
        
            'role.required' => 'El rol es obligatorio',
            'role.exists' => 'El rol seleccionado no es válido',
        ];

        // Validar los datos del formulario
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|exists:roles,id',
        ], $messages);

        // Actualizar los datos del usuario
        $user->update($validatedData);

        // Actualizar el rol del usuario
        if ($request->has('role')) {
            $role = Role::findOrFail($validatedData['role']);
            $user->syncRoles($role->name); // Sincroniza el nuevo rol del usuario
        }

        return Inertia::render('Users/index', [
            'users' => User::getAllUserRoles(),
            'roles' => Role::all(), // Pasar los roles actualizados
            'success' => 'Usuario actualizado exitosamente.'
        ]);
    }


    public function destroy(User $user)
    {
        $user->delete();

        return Inertia::render('Users/index');
    }
}
