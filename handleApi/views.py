from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import generics, status
from .models import Room
from .serializers import RoomSerializer, CreateRoomSerializer,UpdateRoomSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse


# Create your views here.

class RoomView(generics.ListAPIView ):
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


class GetRoomView(APIView):
    serializer_class = RoomSerializer
    lookup_url_kwarg = 'code'

    def get(self, request, format=None):
        code = request.GET.get(self.lookup_url_kwarg)
        if code != None:
            room = Room.objects.filter(code=code)
            if len(room)>0:
                data = RoomSerializer(room[0]).data
                data['isHost'] = self.request.session.session_key == room[0].host
                return Response(data, status=status.HTTP_200_OK)

            return Response({'Room Not Found': 'Invalid Room Code.'}, status=status.HTTP_404_NOT_FOUND)
            
        return Response({'Bad Request': 'Code paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)
    

class JoinRoomView(APIView):
    lookup_url_kwarg = 'code'

    def post(self, request, format=None):
        #Checking if the user has an active current session
        if not self.request.session.exists(self.request.session.session_key):
            #If not create a session
            self.request.session.create()

        code = request.data.get(self.lookup_url_kwarg)
        if code != None:
            room_result = Room.objects.filter(code=code)
            if len(room_result) > 0:
                room = room_result[0]
                self.request.session['room_code'] = code
                return Response({'message': 'Room Joined!'}, status= status.HTTP_200_OK)

            return Response({'Bad Request': 'Invalid Room Code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'Bad Request': 'Invalid post data, did not find a code key'}, status=status.HTTP_400_BAD_REQUEST)


class UserInRoomView(APIView):
    def get(self, request, format=None):
        #Checking if the user has an active current session
        if not self.request.session.exists(self.request.session.session_key):
            #If not create a session
            self.request.session.create()
        data = {
            'code': self.request.session.get('room_code')
        }
        return JsonResponse(data, status=status.HTTP_200_OK)


class LeaveRoomView(APIView):
    def post(self, request, format=None):
        if 'room_code' in self.request.session:
            self.request.session.pop('room_code')
            host_id = self.request.session.session_key
            room_results = Room.objects.filter(host=host_id)
            if len(room_results) > 0:
                room = room_results[0]
                room.delete()

        return Response({'Message': 'Success'}, status=status.HTTP_200_OK)


class UpdateRoomView(APIView):
    serializer_class = UpdateRoomSerializer

    def patch(self, request, format=None):
        if not self.request.session.exists(self.request.session.session_key):
            self.request.session.create()

        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            guestCanPause = serializer.data.get('guestCanPause')
            votesToSkip = serializer.data.get('votesToSkip')
            code = serializer.data.get('code')

            queryset = Room.objects.filter(code=code)
            if not queryset.exists():
                return Response({'msg': 'Room not found.'}, status=status.HTTP_404_NOT_FOUND)

            room = queryset[0]
            user_id = self.request.session.session_key
            if room.host != user_id:
                return Response({'msg': 'You are not the host of this room.'}, status=status.HTTP_403_FORBIDDEN)

            room.guestCanPause = guestCanPause
            room.votesToSkip = votesToSkip
            room.save(update_fields=['guestCanPause', 'votesToSkip'])
            return Response(RoomSerializer(room).data, status=status.HTTP_200_OK)

        return Response({'Bad Request': "Invalid Data..."}, status=status.HTTP_400_BAD_REQUEST)




