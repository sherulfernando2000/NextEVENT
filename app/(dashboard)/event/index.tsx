import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TextInput,
  FlatList,
  Dimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { COLORS, dummyData } from '@/constants';
import { getEvents } from '@/services/eventService';
import { Event } from '@/types/types';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 columns with 16px margins

// interface Event {
//   id: number;
//   type: string;
//   title: string;
//   date?:string;
//   startingTime: string;
//   image: any;
//   description: string;
//   ticketCount?: number
// }

const Events: React.FC = () => {
  const navigation = useNavigation();
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Categories for filtering
  const categories = ['All','Tech', 'Comedy', 'Drama', 'Cinema', 'Standup Comedy', 'Music', 'Sports'];
  const router = useRouter();
  // useEffect(() => {
  //   setEvents(dummyData.Events);
  //   setFilteredEvents(dummyData.Events);
  // }, []);

  const fetchEvents = async () => {
    const events = await getEvents();
    console.log(events)
    setEvents(events)
  }

  useEffect(()=> {
    fetchEvents()
  })



  // Filter events based on search and category
  useEffect(() => {
    let filtered = events;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(event =>
        event.type.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredEvents(filtered);
  }, [searchQuery, selectedCategory, events]);

  const handleCategoryPress = (category: string) => {
    setSelectedCategory(category);
  };

  const handleEventPress = (id: string) => {
    console.log('id.............', id)
     router.push(`/event/${id}`);
  };

  const renderCategoryItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      onPress={() => handleCategoryPress(item)}
      style={{
        paddingHorizontal: 20,
        paddingVertical: 10,
        marginRight: 12,
        backgroundColor: selectedCategory === item ? COLORS.purple : '#374151',
        borderRadius: 20,
        borderWidth: selectedCategory === item ? 0 : 1,
        borderColor: '#4B5563',
      }}
    >
      <Text
        style={{
          color: selectedCategory === item ? 'white' : '#D1D5DB',
          fontWeight: selectedCategory === item ? 'bold' : '500',
          fontSize: 14,
        }}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderEventCard = ({ item, index }: { item: Event; index: number }) => (
    <TouchableOpacity
      onPress={() => handleEventPress(item.id)}
      style={{
        width: cardWidth,
        marginBottom: 16,
        marginRight: index % 2 === 0 ? 16 : 0,
        backgroundColor: '#1F2937',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      <ImageBackground
        source={{ uri: item.imageUrl }}
        style={{
          width: '100%',
          height: 160,
          justifyContent: 'space-between',
        }}
        resizeMode="cover"
      >
        {/* Date Badge */}
        <View
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            backgroundColor: 'white',
            borderRadius: 8,
            padding: 8,
            minWidth: 50,
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 10,
              fontWeight: '600',
              color: '#6B7280',
              textTransform: 'uppercase',
            }}
          >
            {moment(item.date, 'YYYY/MM/DD HH:mm A').format('MMM').toUpperCase()}
          </Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#8B5CF6',
            }}
          >
            {moment(item.startingTime, 'YYYY/MM/DD HH:mm A').format('DD').toUpperCase()}
          </Text>
        </View>

        {/* Gradient Overlay */}
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
            background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
            backgroundColor: 'rgba(0,0,0,0.4)',
          }}
        />
      </ImageBackground>

      {/* Event Info */}
      <View style={{ padding: 12 }}>
        <Text
          style={{
            color: '#8B5CF6',
            fontSize: 12,
            fontWeight: '600',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}
        >
          {item.type}
        </Text>

        <Text
          style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 8,
            lineHeight: 20,
          }}
          numberOfLines={2}
        >
          {item.title}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <Ionicons name="time-outline" size={14} color="#9CA3AF" />
          <Text
            style={{
              color: '#9CA3AF',
              fontSize: 12,
              marginLeft: 6,
            }}
          >
           {moment(item.startingTime).format("YYYY-MM-DD HH:mm")}
          </Text>
        </View>

        <Text
          style={{
            color: '#9CA3AF',
            fontSize: 12,
            lineHeight: 16,
          }}
          numberOfLines={2}
        >
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.black }}>
      <StatusBar barStyle="light-content" />


      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingVertical: 20,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>

        <Text
          style={{
            color: 'white',
            fontSize: 20,
            fontWeight: 'bold',
           
          }}
        >
          EVENTS
        </Text>

        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#374151',
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 1,
          }}
        >
          <Ionicons name="search-outline" size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search events..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="flex-1 text-white py-3 px-2"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>

        {/* Category Filter */}
        <View style={{ marginBottom: 20 }}>
          <FlatList
            data={categories}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16 }}
          />
        </View>

        {/* Events Grid */}
        <View style={{ paddingHorizontal: 16 }}>
          {filteredEvents.length > 0 ? (
            <FlatList
              data={filteredEvents}
              renderItem={renderEventCard}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              scrollEnabled={false}
              columnWrapperStyle={{ justifyContent: 'space-between' }}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 60,
              }}
            >
              <Ionicons name="calendar-outline" size={48} color="#6B7280" />
              <Text
                style={{
                  color: '#9CA3AF',
                  fontSize: 18,
                  fontWeight: '600',
                  marginTop: 16,
                  marginBottom: 8,
                }}
              >
                No Events Found
              </Text>
              <Text
                style={{
                  color: '#6B7280',
                  fontSize: 14,
                  textAlign: 'center',
                  lineHeight: 20,
                }}
              >
                Try adjusting your search or{'\n'}selecting a different category
              </Text>
            </View>
          )}
        </View>

        {/* Results Count */}
        {filteredEvents.length > 0 && (
          <View style={{ paddingHorizontal: 16, paddingBottom: 20 }}>
            <Text
              style={{
                color: '#9CA3AF',
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              Showing {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''}
              {selectedCategory !== 'All' && ` in ${selectedCategory}`}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Events;