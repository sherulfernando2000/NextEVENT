import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { getEventsByUser } from '@/services/eventService';
import { useAuth } from '@/context/AuthContext';


interface Event {
  id: string;
  title: string;
  imageUrl: string;
  date: Date;
  startingTime: Date;
  location?: string;
  ticketPrice?: number;
  ticketsSold?: number;
  description?: string;
}

const OrganizerHome = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEventsByUser = async () => {
    try {
      setLoading(true);
      const fetchedEvents = await getEventsByUser(user ? user.uid : "");
      console.log('events:', fetchedEvents);
      setEvents(fetchedEvents || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      setEvents([]);
    } finally {
      setLoading(false);
      
    }
  };

  useEffect(() => {
    fetchEventsByUser();
  }, []);

  // Helper function to format date
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Helper function to format time
  const formatTime = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Calculate stats based on actual events data
  const stats = {
    totalEvents: events.length,
    activeEvents: events.filter(event => new Date(event.date) >= new Date()).length,
    totalTicketsSold: events.reduce((sum, event) => sum + (event.ticketsSold || 0), 0),
    totalRevenue: events.reduce((sum, event) => sum + ((event.ticketPrice || 0) * (event.ticketsSold || 0)), 0)
  };

  const quickActions = [
    {
      title: 'Create Event',
      subtitle: 'Start planning your next event',
      icon: 'add-circle-outline',
      color: '#702963',
      route: '/organizer/create-event'
    },
    {
      title: 'Manage Tickets',
      subtitle: 'Set pricing and availability',
      icon: 'ticket-outline',
      color: '#059669',
      route: '/organizer/manage-tickets'
    },
    {
      title: 'View Analytics',
      subtitle: 'Track event performance',
      icon: 'analytics-outline',
      color: '#DC2626',
      route: '/organizer/analytics'
    },
    {
      title: 'Promote Event',
      subtitle: 'Share and advertise',
      icon: 'megaphone-outline',
      color: '#7C2D92',
      route: '/organizer/promote'
    }
  ];

  const tips = [
    {
      icon: 'bulb-outline',
      title: 'Optimize Your Event Title',
      description: 'Use clear, descriptive titles that include key details like date and location.'
    },
    {
      icon: 'camera-outline',
      title: 'Upload High-Quality Images',
      description: 'Professional photos increase ticket sales by up to 40%.'
    },
    {
      icon: 'time-outline',
      title: 'Start Promotion Early',
      description: 'Begin marketing 6-8 weeks before your event for maximum reach.'
    }
  ];

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white">Loading events...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="px-4 pt-12 pb-6">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-white text-2xl font-bold">Welcome back!</Text>
            <Text className="text-gray-400 text-base">Let's create amazing events</Text>
          </View>
          <TouchableOpacity className="w-12 h-12 bg-gray-900 rounded-full items-center justify-center">
            <Ionicons name="notifications-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View className="px-4 mb-6">
          <Text className="text-white text-lg font-semibold mb-4">Your Performance</Text>
          <View className="flex-row flex-wrap justify-between">
            <View className="bg-gray-900 rounded-xl p-4 w-[48%] mb-4">
              <Text className="text-white text-2xl font-bold">{stats.totalEvents}</Text>
              <Text className="text-gray-400 text-sm">Total Events</Text>
            </View>
            <View className="bg-gray-900 rounded-xl p-4 w-[48%] mb-4">
              <Text className="text-white text-2xl font-bold">{stats.activeEvents}</Text>
              <Text className="text-gray-400 text-sm">Active Events</Text>
            </View>
            <View className="bg-gray-900 rounded-xl p-4 w-[48%]">
              <Text className="text-white text-2xl font-bold">{stats.totalTicketsSold}</Text>
              <Text className="text-gray-400 text-sm">Tickets Sold</Text>
            </View>
            <View className="bg-gray-900 rounded-xl p-4 w-[48%]">
              <Text className="text-white text-2xl font-bold">LKR {stats.totalRevenue.toLocaleString()}</Text>
              <Text className="text-gray-400 text-sm">Total Revenue</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-4 mb-6">
          <Text className="text-white text-lg font-semibold mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                className="bg-gray-900 rounded-xl p-4 w-[48%] mb-4"
                onPress={() => router.push(action.route as any)}
              >
                <View className="w-12 h-12 rounded-full items-center justify-center mb-3" style={{ backgroundColor: `${action.color}20` }}>
                  <Ionicons name={action.icon as any} size={24} color={action.color} />
                </View>
                <Text className="text-white font-semibold text-base mb-1">{action.title}</Text>
                <Text className="text-gray-400 text-sm">{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Getting Started Guide */}
        <View className="px-4 mb-6">
          <LinearGradient
            colors={['#702963', '#8B3A7C']}
            className="rounded-2xl p-6"
          >
            <View className="flex-row items-center mb-4">
              <Ionicons name="rocket-outline" size={24} color="white" />
              <Text className="text-white text-lg font-bold ml-3">Getting Started</Text>
            </View>
            <Text className="text-white/90 text-sm mb-4">
              New to organizing events? Follow these simple steps to create your first successful event.
            </Text>

            <View className="space-y-3">
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-white/20 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-xs font-bold">1</Text>
                </View>
                <Text className="text-white/90 text-sm flex-1">Create your event with detailed information</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-white/20 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-xs font-bold">2</Text>
                </View>
                <Text className="text-white/90 text-sm flex-1">Set up ticket types and pricing</Text>
              </View>
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-white/20 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-xs font-bold">3</Text>
                </View>
                <Text className="text-white/90 text-sm flex-1">Promote your event to reach more attendees</Text>
              </View>
            </View>

            <TouchableOpacity className="bg-white/20 rounded-lg py-3 mt-4">
              <Text className="text-white text-center font-semibold">View Complete Guide</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Recent Events */}
        <View className="px-4 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-white text-lg font-semibold">Your Events</Text>
            <TouchableOpacity onPress={() => router.push('/(organizer)/events')}>
              <Text className="text-[#702963] font-medium">View All</Text>
            </TouchableOpacity>
          </View>

          {events.length === 0 ? (
            <View className="bg-gray-900 rounded-xl p-6 items-center">
              <Ionicons name="calendar-outline" size={48} color="#702963" />
              <Text className="text-white text-lg font-semibold mt-4 mb-2">No Events Yet</Text>
              <Text className="text-gray-400 text-sm text-center mb-4">
                Create your first event to start managing tickets and tracking performance
              </Text>
              <TouchableOpacity
                className="bg-[#702963] rounded-lg px-6 py-3"
                onPress={() => router.push('/organizer/create-event')}
              >
                <Text className="text-white font-semibold">Create Your First Event</Text>
              </TouchableOpacity>
            </View>
          ) : (
            events.slice(0, 3).map((event, index) => (
              <TouchableOpacity key={event.id} className="bg-gray-900 rounded-xl p-4 mb-3">
                <View className="flex-row">
                  {/* Event Image */}
                  {event.imageUrl && (
                    <Image
                      source={{ uri: event.imageUrl }}
                      className="w-16 h-16 rounded-lg mr-3"
                      resizeMode="cover"
                    />
                  )}
                  
                  <View className="flex-1">
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-white font-semibold text-base flex-1" numberOfLines={1}>
                        {event.title}
                      </Text>
                      <View className={`px-3 py-1 rounded-full ml-2 min-w-[70px] ${
                        new Date(event.date) >= new Date() ? 'bg-green-600/20' : 'bg-gray-600/20'
                      }`}>
                        <Text className={`text-xs font-medium  ${
                          new Date(event.date) >= new Date() ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {new Date(event.date) >= new Date() ? 'Upcoming' : 'Completed'}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-gray-400 text-sm mb-1">
                      {formatDate(event.date)} at {formatTime(event.startingTime)}
                    </Text>

                    {event.location && (
                      <View className="flex-row items-center mb-2">
                        <Ionicons name="location-outline" size={14} color="#9CA3AF" />
                        <Text className="text-gray-400 text-xs ml-1" numberOfLines={1}>
                          {event.location}
                        </Text>
                      </View>
                    )}

                    <View className="flex-row justify-between">
                      <View>
                        <Text className="text-gray-400 text-xs">Tickets Sold</Text>
                        <Text className="text-white font-semibold">{event.ticketsSold || 0}</Text>
                      </View>
                      <View>
                        <Text className="text-gray-400 text-xs">Price</Text>
                        <Text className="text-[#702963] font-semibold">
                          LKR {event.ticketPrice ? event.ticketPrice.toLocaleString() : '0'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Pro Tips */}
        <View className="px-4 mb-6">
          <Text className="text-white text-lg font-semibold mb-4">Pro Tips</Text>
          {tips.map((tip, index) => (
            <View key={index} className="bg-gray-900 rounded-xl p-4 mb-3">
              <View className="flex-row items-start">
                <View className="w-10 h-10 bg-[#702963]/20 rounded-full items-center justify-center mr-3">
                  <Ionicons name={tip.icon as any} size={20} color="#702963" />
                </View>
                <View className="flex-1">
                  <Text className="text-white font-semibold text-base mb-1">{tip.title}</Text>
                  <Text className="text-gray-400 text-sm leading-5">{tip.description}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Support Section */}
        <View className="px-4 mb-8">
          <View className="bg-gray-900 rounded-2xl p-6">
            <View className="flex-row items-center mb-4">
              <Ionicons name="help-circle-outline" size={24} color="#702963" />
              <Text className="text-white text-lg font-semibold ml-3">Need Help?</Text>
            </View>
            <Text className="text-gray-400 text-sm mb-4">
              Our support team is here to help you succeed. Get assistance with event setup, promotion strategies, or technical issues.
            </Text>
            <View className="flex-row gap-3">
              <TouchableOpacity className="bg-[#702963] rounded-lg py-2 px-4 flex-1">
                <Text className="text-white text-center font-semibold">Contact Support</Text>
              </TouchableOpacity>
              <TouchableOpacity className="bg-gray-700 rounded-lg py-2 px-4 flex-1">
                <Text className="text-white text-center font-semibold">View FAQ</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrganizerHome;