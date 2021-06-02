from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics, status
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response


# Create your views here.

class RoomView(generics.CreateAPIView):
    queryset = Room.objects.all()
    serializer_class =  RoomSerializer


class CreateRoomView(APIView):
    serializer_class = CreateRoomSerializer

    def post(self, request, format=None):
        #Checking if the user has an active current session
        if not self.request.session.exists(self.request.session.session_key):
            #If not create a session
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guestCanPause = serializer.data.get('guestCanPause')
            votesToSkip = serializer.data.get('votesToSkip')
            host = self.request.session.session_key
            queryset = Room.objects.filter(host=host)
            # If user already has a room will update that room only
            if queryset.exists():
                room = queryset[0]
                room.guestCanPause = guestCanPause
                room.votesToSkip = votesToSkip
                room.save(update_fields = ['guestCanPause','votesToSkip'])
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)
            else: 
                # Create a new room
                room = Room(host=host, guestCanPause=guestCanPause, votesToSkip=votesToSkip)
                room.save()
                self.request.session['room_code'] = room.code
                return Response(RoomSerializer(room).data, status=status.HTTP_201_CREATED)

        return Response({'Bad Request': 'Invalid data...'}, status=status.HTTP_400_BAD_REQUEST)











