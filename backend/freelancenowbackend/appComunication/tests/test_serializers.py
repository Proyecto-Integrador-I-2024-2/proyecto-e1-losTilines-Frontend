from django.test import TestCase
from rest_framework.exceptions import ValidationError
from app.models import User, Freelancer, Comment
from appComunication.serializers import CommentSerializer
from django.contrib.auth.models import Group

class CommentSerializerTest(TestCase):

    def create_freelancer_user(self, email="freelancer@example.com"):
        user = User.objects.create(
            email=email,
            first_name="Freelancer",
            last_name="User",
            phone_number="123456789"
        )
        group, _ = Group.objects.get_or_create(name='Freelancer')  # Crea el grupo si no existe
        user.groups.add(group)
        return user

    def create_freelancer(self, user):
        return Freelancer.objects.create(user=user, description="Freelancer description", portfolio="Portfolio link")

    def create_writer_user(self, email="writer@example.com"):
        return User.objects.create(
            email=email,
            first_name="Writer",
            last_name="User",
            phone_number="987654321"
        )

    def create_comment(self, freelancer, writer, title="Test Comment", description="This is a test comment", stars=5):
        return Comment.objects.create(
            freelancer=freelancer,
            writer=writer,
            title=title,
            description=description,
            stars=stars
        )

    def setUp(self):
        self.freelancer_user = self.create_freelancer_user()
        self.freelancer = self.create_freelancer(self.freelancer_user)
        self.writer = self.create_writer_user()

    def test_comment_serialization(self):
        comment = self.create_comment(self.freelancer, self.writer)
        serializer = CommentSerializer(comment)
        data = serializer.data

        # Verificar la serialización de los campos
        self.assertEqual(data['title'], comment.title)
        self.assertEqual(data['description'], comment.description)
        self.assertEqual(data['stars'], comment.stars)
        self.assertEqual(data['freelancer_details']['description'], self.freelancer.description)
        self.assertEqual(data['writer']['email'], self.writer.email)

    def test_comment_creation(self):
        data = {
            'freelancer': self.freelancer.pk,  # Usar pk en lugar de id
            'title': "New Comment",
            'description': "This is a new comment",
            'stars': 4
        }
        serializer = CommentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        comment = serializer.save(writer=self.writer)

        # Verificar que el comentario se creó correctamente
        self.assertEqual(comment.title, data['title'])
        self.assertEqual(comment.description, data['description'])
        self.assertEqual(comment.stars, data['stars'])
        self.assertEqual(comment.freelancer, self.freelancer)
        self.assertEqual(comment.writer, self.writer)

    def test_comment_invalid_stars(self):
        data = {
            'freelancer': self.freelancer.pk,  # Usar pk en lugar de id
            'title': "Invalid Stars",
            'description': "This comment has an invalid star rating",
            'stars': 6  # Valor fuera del rango permitido
        }
        serializer = CommentSerializer(data=data)
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)
