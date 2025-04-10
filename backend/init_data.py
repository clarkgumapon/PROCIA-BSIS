from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, User, Product
from passlib.context import CryptContext

# Create database engine
engine = create_engine('sqlite:///coffee_shop.db')
Base.metadata.create_all(engine)

# Create session
Session = sessionmaker(bind=engine)
session = Session()

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Create admin user
admin_user = User(
    username="admin",
    hashed_password=pwd_context.hash("admin123"),
    is_admin=True
)

# Clear existing data
session.query(User).delete()
session.query(Product).delete()

# Add admin user
session.add(admin_user)

# Products data
products = [
    # Hot Coffee
    {
        "name": "Classic Espresso",
        "description": "Rich and bold single shot of pure coffee essence",
        "price": 95.00,
        "category": "Hot Coffee",
        "image_url": "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Cappuccino",
        "description": "Espresso with steamed milk and luxurious foam",
        "price": 120.00,
        "category": "Hot Coffee",
        "image_url": "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Caramel Macchiato",
        "description": "Espresso with vanilla, steamed milk and caramel drizzle",
        "price": 135.00,
        "category": "Hot Coffee",
        "image_url": "https://images.unsplash.com/photo-1587734195503-904fca47e0e9?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Cafe Mocha",
        "description": "Espresso with rich chocolate and steamed milk",
        "price": 130.00,
        "category": "Hot Coffee",
        "image_url": "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Vanilla Latte",
        "description": "Espresso with vanilla syrup and steamed milk",
        "price": 125.00,
        "category": "Hot Coffee",
        "image_url": "https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Flat White",
        "description": "Espresso with velvety steamed milk",
        "price": 115.00,
        "category": "Hot Coffee",
        "image_url": "https://images.unsplash.com/photo-1577968897966-3d4325b36b61?w=500&q=80",
        "is_available": True
    },
    
    # Iced Coffee
    {
        "name": "Iced Americano",
        "description": "Chilled espresso with cold water and ice",
        "price": 110.00,
        "category": "Iced Coffee",
        "image_url": "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Iced Caramel Latte",
        "description": "Cold espresso with milk, caramel and ice",
        "price": 140.00,
        "category": "Iced Coffee",
        "image_url": "https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Iced Mocha",
        "description": "Cold espresso with chocolate, milk and ice",
        "price": 145.00,
        "category": "Iced Coffee",
        "image_url": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Cold Brew",
        "description": "Smooth, slow-steeped cold coffee",
        "price": 130.00,
        "category": "Iced Coffee",
        "image_url": "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Iced Vanilla Latte",
        "description": "Cold espresso with vanilla syrup and milk",
        "price": 135.00,
        "category": "Iced Coffee",
        "image_url": "https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Frappuccino",
        "description": "Blended coffee with milk and ice",
        "price": 150.00,
        "category": "Iced Coffee",
        "image_url": "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&q=80",
        "is_available": True
    },

    # Pastries
    {
        "name": "Butter Croissant",
        "description": "Flaky, buttery French pastry",
        "price": 85.00,
        "category": "Pastries",
        "image_url": "https://images.unsplash.com/photo-1549903072-7e6e0bedb7fb?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Chocolate Muffin",
        "description": "Rich chocolate muffin with chocolate chips",
        "price": 75.00,
        "category": "Pastries",
        "image_url": "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Blueberry Danish",
        "description": "Sweet pastry filled with blueberries",
        "price": 90.00,
        "category": "Pastries",
        "image_url": "https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Cinnamon Roll",
        "description": "Soft roll with cinnamon and cream cheese frosting",
        "price": 95.00,
        "category": "Pastries",
        "image_url": "https://images.unsplash.com/photo-1509365465985-25d11c17e812?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Almond Biscotti",
        "description": "Crunchy Italian cookie with almonds",
        "price": 65.00,
        "category": "Pastries",
        "image_url": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Cheese Danish",
        "description": "Flaky pastry with sweet cheese filling",
        "price": 85.00,
        "category": "Pastries",
        "image_url": "https://images.unsplash.com/photo-1587536849024-daaa4a417b16?w=500&q=80",
        "is_available": True
    },

    # Food
    {
        "name": "Ham & Cheese Sandwich",
        "description": "Classic sandwich with ham and melted cheese",
        "price": 145.00,
        "category": "Food",
        "image_url": "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Caesar Salad",
        "description": "Fresh romaine with Caesar dressing and croutons",
        "price": 160.00,
        "category": "Food",
        "image_url": "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Chicken Pesto Panini",
        "description": "Grilled sandwich with chicken and pesto",
        "price": 165.00,
        "category": "Food",
        "image_url": "https://images.unsplash.com/photo-1528736235302-52922df5c122?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Tuna Sandwich",
        "description": "Fresh tuna salad on whole grain bread",
        "price": 140.00,
        "category": "Food",
        "image_url": "https://images.unsplash.com/photo-1554433607-66b5efe9d304?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Greek Yogurt Parfait",
        "description": "Yogurt with granola and fresh berries",
        "price": 130.00,
        "category": "Food",
        "image_url": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=500&q=80",
        "is_available": True
    },
    {
        "name": "Quiche Lorraine",
        "description": "Savory tart with bacon and cheese",
        "price": 155.00,
        "category": "Food",
        "image_url": "https://images.unsplash.com/photo-1605522561233-768ad7a8fabf?w=500&q=80",
        "is_available": True
    }
]

# Add products
for product_data in products:
    product = Product(**product_data)
    session.add(product)

# Commit changes
session.commit()

print("Admin user created with username: admin / password: admin123")
print("Sample data initialized successfully!") 