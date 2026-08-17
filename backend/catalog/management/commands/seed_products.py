from decimal import Decimal
from io import BytesIO

from django.contrib.auth import get_user_model
from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from PIL import Image, ImageDraw, ImageFont

from catalog.models import Category, Product

PALETTE = [
    (124, 33, 27),
    (209, 29, 94),
    (29, 127, 141),
    (248, 194, 207),
]

SEED_PRODUCTS = [
    {
        "name": "Manga pastelera profesional 16\"",
        "description": "Manga reutilizable de alta resistencia, ideal para cremas y frosting. Incluye anillo de acople.",
        "price": Decimal("28.90"),
        "category": "Herramientas",
        "featured": True,
    },
    {
        "name": "Set boquillas rusas (6 piezas)",
        "description": "Boquillas de acero inoxidable para flores y texturas. Compatible con mangas estándar.",
        "price": Decimal("45.00"),
        "category": "Boquillas",
        "featured": True,
    },
    {
        "name": "Espátula angular 20 cm",
        "description": "Acero inoxidable con mango ergonómico. Perfecta para alisar tortas y coberturas.",
        "price": Decimal("22.50"),
        "category": "Herramientas",
        "featured": False,
    },
    {
        "name": "Cortadores geométricos (set 12)",
        "description": "Cortadores de plástico alimentario en formas geométricas para cookies y fondant.",
        "price": Decimal("18.00"),
        "category": "Moldes",
        "featured": False,
    },
    {
        "name": "Base giratoria antideslizante",
        "description": "Plato giratorio de 30 cm con base de goma. Estabilidad para decorado profesional.",
        "price": Decimal("55.00"),
        "category": "Equipamiento",
        "featured": True,
    },
    {
        "name": "Colorante gel fucsia 30 g",
        "description": "Colorante concentrado en gel, tono intenso y estable al hornear.",
        "price": Decimal("12.90"),
        "category": "Colorantes",
        "featured": False,
    },
    {
        "name": "Moldes silicona cupcakes (12 cavidades)",
        "description": "Silicona grade alimentaria, antiadherente y apta para horno y congelador.",
        "price": Decimal("32.00"),
        "category": "Moldes",
        "featured": False,
    },
    {
        "name": "Nivelador de tortas ajustable",
        "description": "Cuchilla en acero con guías ajustables para capas uniformes.",
        "price": Decimal("39.90"),
        "category": "Herramientas",
        "featured": True,
    },
]


def make_product_image(title: str, color_index: int) -> ContentFile:
    w, h = 800, 800
    bg = PALETTE[color_index % len(PALETTE)]
    accent = PALETTE[(color_index + 2) % len(PALETTE)]
    img = Image.new("RGB", (w, h), bg)
    draw = ImageDraw.Draw(img)

    draw.ellipse([120, 140, 680, 700], fill=accent)
    draw.ellipse([220, 240, 580, 600], fill=(255, 248, 250))
    draw.rectangle([0, 0, w, 90], fill=(255, 255, 255, 40))

    label = title[:28]
    try:
        font = ImageFont.truetype("arial.ttf", 36)
    except OSError:
        font = ImageFont.load_default()

    bbox = draw.textbbox((0, 0), label, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(((w - tw) / 2, 700), label, fill=(255, 255, 255), font=font)

    buffer = BytesIO()
    img.save(buffer, format="JPEG", quality=88)
    return ContentFile(buffer.getvalue())


class Command(BaseCommand):
    help = "Crea categorías, productos de ejemplo y usuario admin (admin / admin123)"

    def handle(self, *args, **options):
        User = get_user_model()
        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(
                "admin", "admin@decocakeshop.local", "admin123"
            )
            self.stdout.write(
                self.style.SUCCESS("Usuario admin creado (admin / admin123)")
            )
        else:
            self.stdout.write("Usuario admin ya existe")

        categories = {}
        for item in SEED_PRODUCTS:
            cat_name = item["category"]
            if cat_name not in categories:
                cat, _ = Category.objects.get_or_create(name=cat_name)
                categories[cat_name] = cat

        created = 0
        for index, item in enumerate(SEED_PRODUCTS):
            if Product.objects.filter(name=item["name"]).exists():
                continue
            product = Product(
                name=item["name"],
                description=item["description"],
                price=item["price"],
                category=categories[item["category"]],
                featured=item["featured"],
                is_active=True,
            )
            filename = f"seed_{index + 1}.jpg"
            product.image.save(
                filename, make_product_image(item["name"], index), save=False
            )
            product.save()
            created += 1

        self.stdout.write(
            self.style.SUCCESS(f"Seed completado. Productos nuevos: {created}")
        )
