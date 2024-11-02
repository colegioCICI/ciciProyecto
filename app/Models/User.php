<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\Notifiable;
use OwenIt\Auditing\Contracts\Auditable;

class User extends Authenticatable implements Auditable
{
    use \OwenIt\Auditing\Auditable;
    use HasRoles;
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    //Relacion de uno a muchos
    public function folder()
    {
        return $this->hasMany('App\Models\Folder');
    }

    public static function getAllUserRoles()
    {
        $authUserId = Auth::id(); // Obtiene el ID del usuario autenticado

        return self::with("roles")
            ->where("id", "!=", $authUserId) // Excluye al usuario autenticado
            ->get()
            ->map(function ($user) {
                return [
                    "id" => $user->id,
                    "name" => $user->name,
                    "email" => $user->email, // Agregar el email del usuario
                    "created_at" => $user->created_at->format('Y-m-d H:i:s'), // Fecha de creación
                    "roles" => $user->roles->map(function ($role) {
                        return [
                            "role_id" => $role->id,
                            "role_name" => $role->name,
                        ];
                    }),
                ];
            });
    }

    public static function getPermissionsByRole()
    {
        return Role::with("permissions")
            ->get()
            ->map(function ($role) {
                return [
                    "role_id" => $role->id,
                    "role_name" => $role->name,
                    "permissions" => $role->permissions->map(function (
                        $permission
                    ) {
                        return [
                            "permission_id" => $permission->id,
                            "permission_name" => $permission->name,
                        ];
                    }),
                ];
            });
    }

    public static function getPermissionAuthUser()
    {
        $user = Auth::user();

        if (!$user) {
            return null;
        }

        return [
            "user_id" => $user->id,
            "user_name" => $user->name,
            "roles" => $user->roles->map(function ($role) {
                return [
                    "role_id" => $role->id,
                    "role_name" => $role->name,
                    "permissions" => $role->permissions->map(function ($permission) {
                        return [
                            "permission_id" => $permission->id,
                            "permission_name" => $permission->name,
                        ];
                    }),
                ];
            }),
        ];
    }
}
