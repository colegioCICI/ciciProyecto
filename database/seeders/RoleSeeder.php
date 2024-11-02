<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        //Eliminar Roles y permisos existentes de forma que no haya duplicados
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();


        //Crear permisos individuales
        Permission::create(['name' => 'view.home', 'description' => 'Ver Home']);

        Permission::create(['name' => 'view.roles', 'description' => 'Ver roles']);
        Permission::create(['name' => 'create.roles', 'description' => 'Crear roles']);
        Permission::create(['name' => 'edit.roles', 'description' => 'Editar roles']);
        Permission::create(['name' => 'delete.roles', 'description' => 'Eliminar roles']);

        Permission::create(['name' => 'view.folders', 'description' => 'Ver carpetas']);
        Permission::create(['name' => 'create.folders', 'description' => 'Crear carpetas']);
        Permission::create(['name' => 'edit.folders', 'description' => 'Editar carpetas']);
        Permission::create(['name' => 'delete.folders', 'description' => 'Eliminar carpetas']);

        Permission::create(['name' => 'view.notification', 'description' => 'Ver notificaciones']);
        Permission::create(['name' => 'create.notification', 'description' => 'Crear notificaciones']);
        Permission::create(['name' => 'edit.notification', 'description' => 'Editar notificaciones']);
        Permission::create(['name' => 'delete.notification', 'description' => 'Eliminar notificaciones']);

        Permission::create(['name' => 'view.users', 'description' => 'Ver usuarios']);
        Permission::create(['name' => 'create.users', 'description' => 'Crear usuarios']);
        Permission::create(['name' => 'edit.users', 'description' => 'Editar usuarios']);
        Permission::create(['name' => 'delete.users', 'description' => 'Eliminar usuarios']);

        Permission::create(['name' => 'view.profile', 'description' => 'Ver Perfil']);
        Permission::create(['name' => 'edit.profile', 'description' => 'Actualizar Perfil']);
        Permission::create(['name' => 'delete.profile', 'description' => 'Actualizar Perfil']);

        Permission::create(['name' => 'view.document', 'description' => 'Ver documentos']);
        Permission::create(['name' => 'create.document', 'description' => 'Crear documentos']);
        Permission::create(['name' => 'edit.document', 'description' => 'Editar documentos']);
        Permission::create(['name' => 'delete.document', 'description' => 'Eliminar documentos']);

        Permission::create(['name' => 'view.reviews', 'description' => 'Ver revisiones']);
        Permission::create(['name' => 'create.reviews', 'description' => 'Crear revisiones']);
        Permission::create(['name' => 'edit.reviews', 'description' => 'Editar revisiones']);
        Permission::create(['name' => 'delete.reviews', 'description' => 'Eliminar revisiones']);

        Permission::create(['name' => 'view.observation', 'description' => 'Ver observaciones']);
        Permission::create(['name' => 'create.observation', 'description' => 'Crear observaciones']);
        Permission::create(['name' => 'edit.observation', 'description' => 'Editar observaciones']);
        Permission::create(['name' => 'delete.observation', 'description' => 'Eliminar observaciones']);

        Permission::create(['name' => 'view.corrections', 'description' => 'Ver correcciones']);
        Permission::create(['name' => 'create.corrections', 'description' => 'Crear correcciones']);
        Permission::create(['name' => 'edit.corrections', 'description' => 'Editar correcciones']);
        Permission::create(['name' => 'delete.corrections', 'description' => 'Eliminar correcciones']);

        Permission::create(['name' => 'view.facturas', 'description' => 'Ver factura']);
        Permission::create(['name' => 'create.facturas', 'description' => 'Crear factura']);
        Permission::create(['name' => 'edit.facturas', 'description' => 'Editar factura']);
        Permission::create(['name' => 'delete.facturas', 'description' => 'Eliminar factura']);

        Permission::create(['name' => 'manage.export', 'description' => 'Generar Reportes']);

        Permission::create(['name' => 'manage.audit', 'description' => 'Visualizar Auditoria']);

        $ingPresidente = Role::create(['name' => 'ingPresidente', 'description' => 'Encargado de Roles y Usuarios']);

        $ingPresidente->givePermissionTo([
            'view.home',
            'view.profile',
            'edit.profile',
            'view.roles',
            'create.roles',
            'edit.roles',
            'delete.roles',
            'view.users',
            'create.users',
            'edit.users',
            'delete.users',
            'view.folders',
            'edit.folders',
            'view.notification',
            'create.notification',
            'edit.notification',
            'delete.notification',
            'view.document',
            'create.document',
            'edit.document',
            'delete.document',
            'view.reviews',
            'create.reviews',
            'edit.reviews',
            'delete.reviews',
            'view.observation',
            'create.observation',
            'edit.observation',
            'delete.observation',
            'view.corrections',
            'create.corrections',
            'edit.corrections',
            'delete.corrections',
            'view.facturas',
            'create.facturas',
            'edit.facturas',
            'delete.facturas',
            'manage.export',
            'manage.audit',

        ]);

        $secretaria = Role::create(['name' => 'secretaria', 'description' => 'Encargada Gestión CICI']);
        $secretaria->givePermissionTo([
            'view.home',
            'view.profile',
            'edit.profile',
            'view.folders',
            'create.folders',
            'edit.folders',
            'delete.folders',
            'view.users',
            'create.users',
            'edit.users',
            'delete.users',
            'view.document',
            'create.document',
            'edit.document',
            'delete.document',
            'view.reviews',
            'create.reviews',
            'edit.reviews',
            'delete.reviews',
            'view.observation',
            'create.observation',
            'edit.observation',
            'delete.observation',
            'view.corrections',
            'create.corrections',
            'edit.corrections',
            'delete.corrections',
            'view.notification',
            'create.notification',
            'edit.notification',
            'delete.notification',
            'view.facturas',
            'create.facturas',
            'edit.facturas',
            'delete.facturas',
            'manage.export',
            'manage.audit',
        ]);

        $ingRevisor = Role::create(['name' => 'ingRevisor', 'description' => 'Encargado de Revisión de PE']);
        $ingRevisor->givePermissionTo([
            'view.home',
            'view.users',
            'view.profile',
            'edit.profile',
            'view.folders',
            'edit.folders',
            'view.document',
            'edit.document',
            'view.reviews',
            'create.reviews',
            'edit.reviews',
            'delete.reviews',
            'view.observation',
            'create.observation',
            'edit.observation',
            'delete.observation',
            'view.corrections',
            'create.corrections',
            'edit.corrections',
            'delete.corrections',
            'view.notification',
            'create.notification',
            'edit.notification',
            'delete.notification',
            'manage.export',
        ]);

        $developer = Role::create(['name' => 'developer', 'description' => 'desarrollador']);
        $developer->givePermissionTo([
            'view.home',
            'view.roles',
            'create.roles',
            'edit.roles',
            'delete.roles',
            'view.profile',
            'edit.profile',
            'view.folders',
            'create.folders',
            'edit.folders',
            'delete.folders',
            'view.users',
            'create.users',
            'edit.users',
            'delete.users',
            'view.profile',
            'view.document',
            'create.document',
            'edit.document',
            'delete.document',
            'view.reviews',
            'create.reviews',
            'edit.reviews',
            'delete.reviews',
            'view.observation',
            'create.observation',
            'edit.observation',
            'delete.observation',
            'view.corrections',
            'create.corrections',
            'edit.corrections',
            'delete.corrections',
            'view.notification',
            'create.notification',
            'edit.notification',
            'delete.notification',
            'view.facturas',
            'create.facturas',
            'edit.facturas',
            'delete.facturas',
            'manage.export',
            'manage.audit',
        ]);

        $normal = Role::create(['name' => 'normal', 'description' => 'normal']);
        $normal->givePermissionTo([
            'view.home',
            'view.users',
            'view.profile',
            'view.folders',
            'view.document',
            'view.notification',
            'view.observation',
            'view.reviews',
            'edit.profile',
            'manage.audit',
        ]);
    }
}
