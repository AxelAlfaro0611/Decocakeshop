from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.shortcuts import redirect
from django.urls import include, path

admin.site.site_header = "DecoCakeShop"
admin.site.site_title = "DecoCakeShop Admin"
admin.site.index_title = "Gestión de productos"
admin.site.site_url = settings.FRONTEND_URL


def redirect_to_store(_request):
    return redirect(settings.FRONTEND_URL)


urlpatterns = [
    path("", redirect_to_store, name="store-redirect"),
    path("admin/", admin.site.urls),
    path("api/", include("catalog.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
