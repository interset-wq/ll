"""
Generate fake users, topics, and entries for development.

Usage:
    uv run python scripts/generate_data.py [--users N] [--topics-per-user N] [--entries-per-topic N]
"""

import os
import sys
import random
import argparse

import django
from faker import Faker

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
django.setup()

from django.contrib.auth.models import User
from learning_logs.models import Topic, Entry

fake = Faker('zh_CN')


def create_users(n):
    users = []
    for i in range(n):
        username = fake.user_name()
        email = fake.email()
        password = 'testpass123'
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            first_name=fake.first_name(),
            last_name=fake.last_name(),
        )
        users.append(user)
        print(f'  User {i+1}/{n}: {username} ({email})')
    return users


def create_topics(users, topics_per_user):
    topics = []
    for user in users:
        for _ in range(topics_per_user):
            topic = Topic.objects.create(
                text=fake.sentence(nb_words=random.randint(3, 8)),
                owner=user,
            )
            topics.append(topic)
    print(f'  Created {len(topics)} topics')
    return topics


def create_entries(topics, entries_per_topic):
    count = 0
    for topic in topics:
        n = random.randint(1, entries_per_topic)
        for _ in range(n):
            title = fake.sentence(nb_words=random.randint(3, 8)).rstrip('.')
            paragraphs = '\n\n'.join(fake.paragraphs(nb=random.randint(1, 4)))
            Entry.objects.create(
                title=title,
                text=paragraphs,
                topic=topic,
            )
            count += 1
    print(f'  Created {count} entries')


def main():
    parser = argparse.ArgumentParser(description='Generate fake data')
    parser.add_argument('--users', type=int, default=10, help='Number of users')
    parser.add_argument('--topics-per-user', type=int, default=5, help='Topics per user')
    parser.add_argument('--entries-per-topic', type=int, default=8, help='Max entries per topic')
    parser.add_argument('--admin', action='store_true', help='Generate data for admin user')
    parser.add_argument('--admin-topics', type=int, default=20, help='Topics for admin (with --admin)')
    parser.add_argument('--admin-entries', type=int, default=10, help='Entries per admin topic (with --admin)')
    args = parser.parse_args()

    if args.admin:
        admin = User.objects.get(username='admin')
        print(f'Creating data for admin ({args.admin_topics} topics, up to {args.admin_entries} entries each)...')
        topics = []
        for _ in range(args.admin_topics):
            topic = Topic.objects.create(
                text=fake.sentence(nb_words=random.randint(3, 8)),
                owner=admin,
            )
            topics.append(topic)
        print(f'  Created {len(topics)} topics')
        create_entries(topics, args.admin_entries)

    if args.users > 0:
        print(f'\nCreating {args.users} users...')
        users = create_users(args.users)

        print('Creating topics...')
        topics = create_topics(users, args.topics_per_user)

        print('Creating entries...')
        create_entries(topics, args.entries_per_topic)

    print('Done!')


if __name__ == '__main__':
    main()
