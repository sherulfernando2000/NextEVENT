import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { dummyData } from '@/constants';

// Define the Event interface
interface Event {
  id: number;
  title: string;
  image: any;
  startingTime: string;
  description?: string;
  location?: string;
  price?: number;
  type?: string;
}

const EventDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('ABOUT');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (id) {
        try {
          setLoading(true);
          
          // Find the event that matches the id
          const foundEvent = dummyData.Events.find((event) => {
            return event.id === parseInt(id as string);
          });
          
          if (foundEvent) {
            setSelectedEvent(foundEvent);
          }
          
        } catch (error) {
          console.error('Error loading event:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    load()
  }, [id]);

  // Handle loading state
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 18 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  // Handle case where selectedEvent is not found
  if (!selectedEvent) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'white', fontSize: 18 }}>Event not found</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: '#8B5CF6',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            marginTop: 20,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView style={{ flex: 1 }}>
        {/* Header Image with Overlay */}
        <ImageBackground
          source={selectedEvent.image}
          style={{
            width: '100%',
            height: 400,
            justifyContent: 'space-between',
          }}
        >
          {/* Top Navigation */}
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingTop: 20,
          }}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                borderRadius: 25,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: 25,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="heart-outline" size={24} color="white" />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  borderRadius: 25,
                  width: 40,
                  height: 40,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons name="share-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Gradient Overlay */}
          <View style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            paddingHorizontal: 20,
            paddingVertical: 30,
          }}>
            {/* Event Category/Type */}
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '500',
              marginBottom: 8,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}>
              {selectedEvent.type || 'SHOW'}
            </Text>
            
            {/* Event Title */}
            <Text style={{
              color: 'white',
              fontSize: 28,
              fontWeight: 'bold',
              marginBottom: 8,
            }}>
              {selectedEvent.title}
            </Text>
            
            {/* Starting Time */}
            <Text style={{
              color: '#E5E7EB',
              fontSize: 16,
              marginBottom: 16,
            }}>
              STARTING {selectedEvent.startingTime}
            </Text>
            
            {/* Date Badge */}
            <View style={{
              position: 'absolute',
              top: -20,
              right: 20,
              backgroundColor: '#8B5CF6',
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
              alignItems: 'center',
            }}>
              <Text style={{
                color: 'white',
                fontSize: 12,
                fontWeight: '500',
              }}>
                {moment(selectedEvent.startingTime.split(' ')[0]).format('MMM').toUpperCase()}
              </Text>
              <Text style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
                {moment(selectedEvent.startingTime.split(' ')[0]).format('DD')}
              </Text>
            </View>
          </View>
        </ImageBackground>

        {/* Content Section */}
        <View style={{
          backgroundColor: '#1F2937',
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          marginTop: -24,
          paddingTop: 24,
          minHeight: 400,
        }}>
          {/* Tab Navigation */}
          <View style={{
            flexDirection: 'row',
            paddingHorizontal: 20,
            marginBottom: 24,
          }}>
            {['ABOUT', 'PARTICIPANTS'].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  paddingVertical: 12,
                  paddingHorizontal: 20,
                  backgroundColor: activeTab === tab ? 'white' : 'transparent',
                  borderRadius: 20,
                  marginRight: 12,
                }}
              >
                <Text style={{
                  color: activeTab === tab ? '#1F2937' : '#9CA3AF',
                  fontWeight: activeTab === tab ? 'bold' : '500',
                  fontSize: 14,
                }}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Tab Content */}
          <View style={{ paddingHorizontal: 20 }}>
            {activeTab === 'ABOUT' ? (
              <View>
                <Text style={{
                  color: '#E5E7EB',
                  fontSize: 16,
                  lineHeight: 24,
                  marginBottom: 24,
                }}>
                  {selectedEvent.description || 
                   "Lorem ipsum dolor sit amet, consectetur elit adipiscing elit. Venenatis pulvinar a amet in, suspendisse vitae, posuere eu tortor et. Unc commodo, fermentum, mauris leo eget."}
                </Text>

                {/* Location */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={{
                    color: 'white',
                    fontSize: 18,
                    fontWeight: 'bold',
                    marginBottom: 16,
                  }}>
                    LOCATION
                  </Text>
                  
                  <View style={{
                    backgroundColor: '#374151',
                    borderRadius: 12,
                    height: 120,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <Text style={{
                      color: '#9CA3AF',
                      fontSize: 14,
                    }}>
                      {selectedEvent.location || 'Location Map'}
                    </Text>
                  </View>
                </View>

                {/* Price Section */}
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 24,
                }}>
                  <View>
                    <Text style={{
                      color: 'white',
                      fontSize: 18,
                      fontWeight: 'bold',
                      marginBottom: 4,
                    }}>
                      PRICE
                    </Text>
                    <Text style={{
                      color: 'white',
                      fontSize: 24,
                      fontWeight: 'bold',
                    }}>
                      ${selectedEvent.price || '17.60'}/person
                    </Text>
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <Text style={{
                  color: '#E5E7EB',
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 40,
                }}>
                  Participants information will be shown here
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Buy Ticket Button */}
      <View style={{
        backgroundColor: '#1F2937',
        paddingHorizontal: 20,
        paddingVertical: 20,
        paddingBottom: 40,
      }}>
        <TouchableOpacity
          style={{
            backgroundColor: '#8B5CF6',
            borderRadius: 25,
            paddingVertical: 16,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
            marginRight: 8,
          }}>
            BUY A TICKET
          </Text>
          <Ionicons name="ticket-outline" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EventDetail;