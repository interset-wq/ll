from django.contrib.auth.models import User
from rest_framework import serializers

from learning_logs.models import Topic, Entry


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'date_joined']
        read_only_fields = ['id', 'date_joined']


class TopicSerializer(serializers.ModelSerializer):
    entry_count = serializers.SerializerMethodField()

    class Meta:
        model = Topic
        fields = ['id', 'text', 'date_added', 'entry_count']
        read_only_fields = ['id', 'date_added']

    def get_entry_count(self, obj):
        return obj.entry_set.count()


class EntrySerializer(serializers.ModelSerializer):
    topic_id = serializers.PrimaryKeyRelatedField(
        queryset=Topic.objects.all(), source='topic', write_only=True
    )
    topic_pk = serializers.IntegerField(source='topic.pk', read_only=True)
    topic_text = serializers.CharField(source='topic.text', read_only=True)
    display_title = serializers.CharField(read_only=True)

    class Meta:
        model = Entry
        fields = [
            'id', 'title', 'text', 'display_title',
            'date_added', 'updated_at', 'word_count',
            'favorited', 'topic_id', 'topic_pk', 'topic_text',
        ]
        read_only_fields = ['id', 'date_added', 'updated_at', 'word_count']


class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField(required=False, default='')
    password = serializers.CharField(write_only=True, min_length=8)

    def validate_username(self, value):
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError('Username already taken.')
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        return user
