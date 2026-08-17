from django import forms
from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import (
    SetPasswordMixin,
    UserChangeForm,
    UserCreationForm,
)
from django.contrib.auth.models import Group
from django.utils.html import format_html

from .models import Category, Product

# Ocultar Grupos del panel (no se usan en este proyecto)
admin.site.unregister(Group)

User = get_user_model()
admin.site.unregister(User)


class QuietPasswordWidget(forms.Widget):
    def render(self, name, value, attrs=None, renderer=None):
        return format_html(
            '<p style="margin:0.5em 0;">'
            'Contraseña guardada de forma segura. '
            '<a href="{}">Cambiar contraseña</a>'
            "</p>",
            "../password/",
        )


class QuietUserChangeForm(UserChangeForm):
    password = forms.CharField(
        label="Contraseña",
        required=False,
        widget=QuietPasswordWidget(),
    )


class RequiredPasswordUserCreationForm(UserCreationForm):
    """Siempre exige contraseña al crear un usuario (sin opción de deshabilitarla)."""


class RequiredPasswordChangeForm(SetPasswordMixin, forms.Form):
    """Cambio de contraseña sin opción de deshabilitar autenticación por contraseña."""

    required_css_class = "required"
    password1, password2 = SetPasswordMixin.create_password_fields()

    def __init__(self, user, *args, **kwargs):
        self.user = user
        super().__init__(*args, **kwargs)
        self.fields["password1"].widget.attrs["autofocus"] = True

    def clean(self):
        self.validate_passwords()
        self.validate_password_for_user(self.user)
        cleaned = super().clean()
        # Compatibilidad con UserAdmin.user_change_password de Django
        cleaned["set_usable_password"] = True
        return cleaned

    def save(self, commit=True):
        return self.set_password_and_save(self.user, commit=commit)

    @property
    def changed_data(self):
        data = super().changed_data
        if "password1" in data and "password2" in data:
            return ["password"]
        return []


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    form = QuietUserChangeForm
    add_form = RequiredPasswordUserCreationForm
    change_password_form = RequiredPasswordChangeForm
    change_user_password_template = "admin/user_change_password.html"
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Información personal", {"fields": ("first_name", "last_name", "email")}),
        ("Estado", {"fields": ("is_active",)}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("username", "password1", "password2"),
            },
        ),
        ("Información personal", {"fields": ("first_name", "last_name", "email")}),
    )
    list_display = ("username", "email", "first_name", "last_name", "is_active")
    list_filter = ("is_active",)
    filter_horizontal = ()

    def save_model(self, request, obj, form, change):
        obj.is_staff = True
        obj.is_superuser = True
        super().save_model(request, obj, form, change)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "created_at")
    fields = ("name",)
    search_fields = ("name",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "thumbnail",
        "name",
        "category",
        "price",
        "is_active",
        "featured",
        "updated_at",
    )
    list_filter = ("is_active", "featured", "category")
    search_fields = ("name", "description")
    list_editable = ("price", "is_active", "featured")
    readonly_fields = ("preview",)

    fieldsets = (
        (
            None,
            {
                "fields": (
                    "name",
                    "category",
                    "description",
                    "price",
                    "image",
                    "preview",
                    "is_active",
                    "featured",
                )
            },
        ),
    )

    def formfield_for_dbfield(self, db_field, request, **kwargs):
        if db_field.name == "image":
            kwargs["widget"] = forms.FileInput(attrs={"accept": "image/*"})
        formfield = super().formfield_for_dbfield(db_field, request, **kwargs)
        if formfield and hasattr(formfield.widget, "can_add_related"):
            formfield.widget.can_add_related = False
            formfield.widget.can_change_related = False
            formfield.widget.can_delete_related = False
            formfield.widget.can_view_related = False
        return formfield

    class Media:
        js = ("catalog/admin_product_preview.js",)

    @admin.display(description="Imagen")
    def thumbnail(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" style="height:48px;width:48px;object-fit:cover;border-radius:8px;" />',
                obj.image.url,
            )
        return "—"

    @admin.display(description="Vista previa")
    def preview(self, obj):
        if obj.pk and obj.image:
            return format_html(
                '<div id="product-image-preview">'
                '<img src="{}" alt="Vista previa" style="max-height:220px;border-radius:12px;" />'
                "</div>",
                obj.image.url,
            )
        return format_html(
            '<div id="product-image-preview">'
            '<span class="preview-empty">{}</span>'
            "</div>",
            "Sin imagen",
        )
