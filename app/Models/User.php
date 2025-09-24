<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Role;
use OwenIt\Auditing\Contracts\Auditable;

class User extends Authenticatable implements Auditable
{
    use HasFactory, Notifiable, HasApiTokens, HasRoles;
    use \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function folder()
    {
        return $this->hasMany('App\Models\Folder');
    }

    public static function getAllUserRoles()
    {
        $authUserId = \Illuminate\Support\Facades\Auth::id();
        return self::with('roles')
            ->where('id', '!=', $authUserId)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at->format('Y-m-d H:i:s'),
                    'roles' => $user->roles->map(function ($role) {
                        return [
                            'role_id' => $role->id,
                            'role_name' => $role->name,
                        ];
                    }),
                ];
            });
    }

    public static function getPermissionsByRole()
    {
        return Role::with('permissions')
            ->get()
            ->map(function ($role) {
                return [
                    'role_id' => $role->id,
                    'role_name' => $role->name,
                    'permissions' => $role->permissions->map(function ($permission) {
                        return [
                            'permission_id' => $permission->id,
                            'permission_name' => $permission->name,
                        ];
                    }),
                ];
            });
    }

    public static function getPermissionAuthUser()
    {
        $user = \Illuminate\Support\Facades\Auth::user();
        if (!$user) {
            return null;
        }

        return [
            'user_id' => $user->id,
            'user_name' => $user->name,
            'roles' => $user->roles->map(function ($role) {
                return [
                    'role_id' => $role->id,
                    'role_name' => $role->name,
                    'permissions' => $role->permissions->map(function ($permission) {
                        return [
                            'permission_id' => $permission->id,
                            'permission_name' => $permission->name,
                        ];
                    }),
                ];
            }),
        ];
    }
}