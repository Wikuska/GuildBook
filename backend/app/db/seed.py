import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session
from pwdlib import PasswordHash
from pwdlib.hashers.argon2 import Argon2Hasher

from app.models import (
    Race, Tag, Category,
    User, UserFollow,
    Post, PostTag, PostVisibleRace, PostLike,
    Comment, Message, Conversation,
    Notification, NotificationType,
)
from app.core.config import settings


DATABASE_URL = settings.DATABASE_URL

engine = create_engine(DATABASE_URL)
password_hash = PasswordHash([Argon2Hasher()])


def hash_password(plain: str) -> str:
    return password_hash.hash(plain)


def seed(db: Session) -> None:
    
    db.execute(text("TRUNCATE TABLE messages RESTART IDENTITY CASCADE"))
    db.execute(text("TRUNCATE TABLE conversations RESTART IDENTITY CASCADE"))
    db.execute(text("TRUNCATE TABLE notifications RESTART IDENTITY CASCADE"))
    db.execute(text("TRUNCATE TABLE posts RESTART IDENTITY CASCADE"))
    db.execute(text("TRUNCATE TABLE users RESTART IDENTITY CASCADE"))
    db.execute(text("TRUNCATE TABLE races RESTART IDENTITY CASCADE"))
    db.execute(text("TRUNCATE TABLE tags RESTART IDENTITY CASCADE"))
    db.execute(text("TRUNCATE TABLE categories RESTART IDENTITY CASCADE"))
    db.execute(text("TRUNCATE TABLE comments RESTART IDENTITY CASCADE"))
    db.execute(text("TRUNCATE TABLE post_likes CASCADE"))
    db.execute(text("TRUNCATE TABLE post_tags CASCADE"))
    db.execute(text("TRUNCATE TABLE post_visible_races CASCADE"))
    db.execute(text("TRUNCATE TABLE user_follows CASCADE"))
    db.flush()

    # -------------------------
    # RACES
    # -------------------------
    race_names = ["Witcher", "Sorcerer", "Dwarf", "Elf", "Human"]
    races = {name: Race(name=name) for name in race_names}
    db.add_all(races.values())
    db.flush()

    # -------------------------
    # TAGS
    # -------------------------
    tag_names = ["alchemy", "weapon", "magic", "blacksmithing", "monsters"]
    tags = {name: Tag(name=name) for name in tag_names}
    db.add_all(tags.values())
    db.flush()

    # -------------------------
    # CATEGORIES
    # -------------------------
    category_names = ["discussion", "market", "help_request", "announcement", "event", "contract"]
    categories = {name: Category(name=name) for name in category_names}
    db.add_all(categories.values())
    db.flush()

    # -------------------------
    # USERS
    # -------------------------
    users_data = [
        {
            "username": "Geralt",
            "email": "geralt@kaermorhen.com",
            "password": "password123",
            "race": "Witcher",
            "bio": "Professional monster slayer. Will work for coin.",
            "location": "Kaer Morhen",
            "is_admin": True,
        },
        {
            "username": "Yennefer",
            "email": "yennefer@aretuza.com",
            "password": "password123",
            "race": "Sorcerer",
            "bio": "Sorceress of Vengerberg. Do not waste my time.",
            "location": "Vengerberg",
            "is_admin": False,
        },
        {
            "username": "Zoltan",
            "email": "zoltan@mahakam.com",
            "password": "password123",
            "race": "Dwarf",
            "bio": "Merchant and adventurer. Best axes in the business.",
            "location": "Mahakam",
            "is_admin": False,
        },
        {
            "username": "Francesca",
            "email": "francesca@dol_blathanna.com",
            "password": "password123",
            "race": "Elf",
            "bio": "Elder of Dol Blathanna. Politics are my craft.",
            "location": "Dol Blathanna",
            "is_admin": False,
        },
        {
            "username": "Dandelion",
            "email": "dandelion@oxenfurt.com",
            "password": "password123",
            "race": "Human",
            "bio": "Poet, bard, and chronicler of great deeds.",
            "location": "Oxenfurt",
            "is_admin": False,
        },
        {
            "username": "Triss",
            "email": "triss@novigrad.com",
            "password": "password123",
            "race": "Sorcerer",
            "bio": "Fourteenth of the Hill. Advisor to kings.",
            "location": "Novigrad",
            "is_admin": False,
        },
    ]

    users = {}
    for data in users_data:
        user = User(
            username=data["username"],
            email=data["email"],
            password_hash=hash_password(data["password"]),
            race_id=races[data["race"]].id,
            bio=data["bio"],
            location=data["location"],
            is_admin=data["is_admin"],
            is_deleted=False,
        )
        db.add(user)
        users[data["username"]] = user

    db.flush()

    # -------------------------
    # POSTS
    # -------------------------
    posts_data = [
        {
            "title": "Griffin contract near Novigrad — high reward",
            "content": "A royal griffin has been spotted terrorizing the villages east of Novigrad. The alderman offers 500 crowns for the head. Bring your best silver sword.",
            "author": "Geralt",
            "category": "contract",
            "tags": ["monsters"],
            "visible_races": [],
        },
        {
            "title": "Swallow potion formula — improved version",
            "content": "After years of experimentation I have refined the Swallow formula. New ratio reduces toxicity by 30% while maintaining regeneration speed. Sharing with fellow witchers only.",
            "author": "Geralt",
            "category": "discussion",
            "tags": ["alchemy"],
            "visible_races": ["Witcher"],
        },
        {
            "title": "Enchanted blade for sale — elven silver",
            "content": "Selling a hand-forged elven silver blade, enchanted with Aard amplification runes. Ideal for wraith hunting. Price negotiable for the right buyer.",
            "author": "Francesca",
            "category": "market",
            "tags": ["weapon", "magic"],
            "visible_races": [],
        },
        {
            "title": "Looking for alchemical supplies in Mahakam",
            "content": "Need a reliable supplier of sulfur, rebis, and vermilion in the Mahakam region. Willing to trade quality dwarven steel in return.",
            "author": "Zoltan",
            "category": "help_request",
            "tags": ["alchemy", "blacksmithing"],
            "visible_races": [],
        },
        {
            "title": "Grand tournament at Beauclair — open to all",
            "content": "The Duchess of Toussaint announces a grand tournament open to all races. Competitions in swordsmanship, archery, and magic. Prizes of great value await the victors.",
            "author": "Dandelion",
            "category": "event",
            "tags": [],
            "visible_races": [],
        },
        {
            "title": "Mage council announcement — restricted",
            "content": "The Brotherhood of Sorcerers convenes at Aretuza. Attendance is mandatory for all active members. Agenda includes the eastern threat and new apprentice assignments.",
            "author": "Yennefer",
            "category": "announcement",
            "tags": ["magic"],
            "visible_races": ["Sorcerer"],
        },
        {
            "title": "Tips for fighting drowners near the coast",
            "content": "Been taking contracts along the Skellige coast. Drowners are clustering in groups of five or more now. Igni sign works best — hit the group before they spread.",
            "author": "Geralt",
            "category": "discussion",
            "tags": ["monsters"],
            "visible_races": [],
        },
        {
            "title": "Master-forged dwarven axes — limited stock",
            "content": "Fresh batch from the Mahakam forges. Rune-etched heads, balanced for both one and two-handed use. First come first served. Contact me in Novigrad.",
            "author": "Zoltan",
            "category": "market",
            "tags": ["weapon", "blacksmithing"],
            "visible_races": [],
        },
    ]

    posts = []
    for data in posts_data:
        post = Post(
            title=data["title"],
            content=data["content"],
            author_id=users[data["author"]].id,
            category_id=categories[data["category"]].id,
        )
        db.add(post)
        db.flush()

        for tag_name in data["tags"]:
            db.add(PostTag(post_id=post.id, tag_id=tags[tag_name].id))

        for race_name in data["visible_races"]:
            db.add(PostVisibleRace(post_id=post.id, race_id=races[race_name].id))

        posts.append(post)

    db.flush()

    # -------------------------
    # COMMENTS
    # -------------------------
    comments_data = [
        {
            "post": posts[0],
            "author": "Zoltan",
            "content": "I know the area. That griffin has a nest on the cliffs north of the mill. Approach from downwind.",
        },
        {
            "post": posts[0],
            "author": "Dandelion",
            "content": "I once wrote a ballad about a griffin hunt. Perhaps the inspiration would be worth a fee reduction, Geralt?",
        },
        {
            "post": posts[2],
            "author": "Triss",
            "content": "The Aard runes on elven blades are notoriously unstable. What binding method did you use?",
        },
        {
            "post": posts[4],
            "author": "Geralt",
            "content": "Is there a purse for the swordsmanship category or just a trophy?",
        },
        {
            "post": posts[4],
            "author": "Yennefer",
            "content": "The magic competition will be interesting. I expect the usual cheating from Nilfgaardian participants.",
        },
        {
            "post": posts[6],
            "author": "Triss",
            "content": "Confirmed. I saw the same pattern near Oxenfurt docks. Something is driving them inland.",
        },
        {
            "post": posts[7],
            "author": "Francesca",
            "content": "Do you ship to Dol Blathanna? We have need of reliable axes for the border guard.",
        },
    ]

    for data in comments_data:
        db.add(Comment(
            content=data["content"],
            post_id=data["post"].id,
            author_id=users[data["author"]].id,
        ))

    db.flush()

    # -------------------------
    # FOLLOWS
    # -------------------------
    follows_data = [
        ("Dandelion", "Geralt"),
        ("Dandelion", "Yennefer"),
        ("Triss", "Geralt"),
        ("Triss", "Yennefer"),
        ("Zoltan", "Geralt"),
        ("Francesca", "Yennefer"),
        ("Geralt", "Triss"),
        ("Yennefer", "Triss"),
    ]

    for follower_name, followed_name in follows_data:
        db.add(UserFollow(
            follower_id=users[follower_name].id,
            followed_id=users[followed_name].id,
        ))

    db.flush()

    # -------------------------
    # LIKES
    # -------------------------
    likes_data = [
        ("Zoltan", posts[0]),
        ("Dandelion", posts[0]),
        ("Triss", posts[0]),
        ("Francesca", posts[2]),
        ("Triss", posts[2]),
        ("Geralt", posts[4]),
        ("Yennefer", posts[4]),
        ("Zoltan", posts[4]),
        ("Dandelion", posts[6]),
        ("Triss", posts[6]),
        ("Francesca", posts[7]),
        ("Geralt", posts[7]),
    ]

    for username, post in likes_data:
        db.add(PostLike(
            user_id=users[username].id,
            post_id=post.id,
        ))

    db.flush()

    # -------------------------
    # MESSAGES
    # -------------------------
    conversations_data = [
        ("Dandelion", "Geralt"),
        ("Triss", "Yennefer"),
        ("Zoltan", "Geralt"),
        ("Francesca", "Triss"),
    ]

    conversations = {}
    for p1_name, p2_name in conversations_data:
        conv = Conversation(
            participant_one_id=users[p1_name].id,
            participant_two_id=users[p2_name].id,
        )
        db.add(conv)
        db.flush()
        conversations[(p1_name, p2_name)] = conv
        conversations[(p2_name, p1_name)] = conv

    def get_conv(a, b):
        return conversations[(a, b)]

    messages_data = [
        ("Dandelion", "Geralt", "Geralt, I heard about the griffin contract. Mind if I tag along for the story?", True),
        ("Geralt", "Dandelion", "You'll slow me down. Stay in Oxenfurt.", True),
        ("Dandelion", "Geralt", "I promise I won't get in the way. Much.", False),
        ("Triss", "Yennefer", "Yen, the council meeting — are you attending in person or by projection?", True),
        ("Yennefer", "Triss", "In person. There are matters that require a physical presence.", True),
        ("Triss", "Yennefer", "I'll see you there then.", False),
        ("Zoltan", "Geralt", "Still need that silver blade sharpened? I have a new whetstone from Mahakam.", True),
        ("Geralt", "Zoltan", "Bring it to the inn tonight. I'll pay in coin.", False),
        ("Francesca", "Triss", "Triss, I need a discreet source of magical reagents. Can you help?", True),
        ("Triss", "Francesca", "Depends on what you need. Send me a list.", False),
    ]

    for sender_name, receiver_name, content, is_read in messages_data:
        conv = get_conv(sender_name, receiver_name)
        db.add(Message(
            conversation_id=conv.id,
            sender_id=users[sender_name].id,
            receiver_id=users[receiver_name].id,
            content=content,
            is_read=is_read,
        ))

    db.flush()

    # -------------------------
    # NOTIFICATIONS
    # -------------------------
    notifications_data = [
        # follows
        {
            "recipient": "Geralt",
            "actor": "Dandelion",
            "type": NotificationType.follow,
            "post": None,
        },
        {
            "recipient": "Geralt",
            "actor": "Triss",
            "type": NotificationType.follow,
            "post": None,
        },
        {
            "recipient": "Geralt",
            "actor": "Zoltan",
            "type": NotificationType.follow,
            "post": None,
        },
        {
            "recipient": "Yennefer",
            "actor": "Dandelion",
            "type": NotificationType.follow,
            "post": None,
        },
        # likes
        {
            "recipient": "Geralt",
            "actor": "Zoltan",
            "type": NotificationType.post_like,
            "post": posts[0],
        },
        {
            "recipient": "Geralt",
            "actor": "Dandelion",
            "type": NotificationType.post_like,
            "post": posts[0],
        },
        {
            "recipient": "Francesca",
            "actor": "Triss",
            "type": NotificationType.post_like,
            "post": posts[2],
        },
        # comments
        {
            "recipient": "Geralt",
            "actor": "Zoltan",
            "type": NotificationType.post_comment,
            "post": posts[0],
        },
        {
            "recipient": "Geralt",
            "actor": "Dandelion",
            "type": NotificationType.post_comment,
            "post": posts[0],
        },
        {
            "recipient": "Francesca",
            "actor": "Triss",
            "type": NotificationType.post_comment,
            "post": posts[2],
        },
        {
            "recipient": "Dandelion",
            "actor": "Geralt",
            "type": NotificationType.post_comment,
            "post": posts[4],
        },
    ]

    for data in notifications_data:
        db.add(Notification(
            recipient_id=users[data["recipient"]].id,
            actor_id=users[data["actor"]].id,
            type=data["type"],
            post_id=data["post"].id if data["post"] else None,
            is_read=False,
        ))

    db.flush()
    db.commit()
    print("Database seeded successfully.")


if __name__ == "__main__":
    with Session(engine) as db:
        seed(db)