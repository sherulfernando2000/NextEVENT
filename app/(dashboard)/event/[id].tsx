import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import moment from 'moment';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, dummyData } from '@/constants';
import { getEventById } from '@/services/eventService';
import { Event } from '@/types/types';
import { addTicketPurchase } from '@/services/ticketService';

const EventDetail: React.FC = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState('ABOUT');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [ticketQuantity, setTicketQuantity] = useState(1);


  const buyTicket = async () => {
    try {
      setSaveLoading(true)
      const resp = await addTicketPurchase({
        eventId: selectedEvent ? selectedEvent.id : "",
        quantity: ticketQuantity
      })

      console.log(resp)
      Alert.alert(
        "Success",
        `Booked ${ticketQuantity} ticket${ticketQuantity > 1 ? 's' : ''} successfully!`,
        [
          {
            text: "OK",
            style: "default"
          }
        ]
      );
      setTicketQuantity(1)
    } catch (error) {
        console.log(error)
    }finally{
      setSaveLoading(false)
    }

  }

  const increaseQuantity = () => {
    const maxTickets = selectedEvent?.ticketQuantity || 10;
    if (ticketQuantity < maxTickets) {
      setTicketQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (ticketQuantity > 1) {
      setTicketQuantity(prev => prev - 1);
    }
  };

  useEffect(() => {
    const load = async () => {
      if (id) {
        try {
          setLoading(true);

          const foundEvent = await getEventById(id);

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
      <SafeAreaView style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', alignItems: 'center' }}>
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

  const totalPrice = (selectedEvent.ticketprice || 0) * ticketQuantity;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />

      <ScrollView style={{ flex: 1, marginBottom: 25 }}>
        {/* Header Image with Overlay */}
        <ImageBackground
          source={{ uri: selectedEvent.imageUrl }}
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
              onPress={() => router.push('/event')}
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
              fontSize: 15,
              marginBottom: 16,
            }}>
              Date: {moment(selectedEvent.startingTime).format('MMMM Do YYYY')}
            </Text>

            <Text style={{
              color: '#E5E7EB',
              fontSize: 15,
              marginBottom: 16,
            }}>
              Time: {moment(selectedEvent.startingTime).format('h:mm a')}
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
                {moment(selectedEvent.startingTime, 'YYYY/MM/DD HH:mm A').format('MMM').toUpperCase()}
              </Text>
              <Text style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
              }}>
                {moment(selectedEvent.startingTime, 'YYYY/MM/DD HH:mm A').format('DD').toUpperCase()}
              </Text>
            </View>
          </View>
        </ImageBackground>

        {/* Content Section */}
        <View style={{
          backgroundColor: '#111827',
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
                  fontSize: 13,
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
                  fontSize: 14,
                  lineHeight: 24,
                  marginBottom: 24,
                }}>
                  {selectedEvent.description ||
                    "Lorem ipsum dolor sit amet, consectetur elit adipiscing elit. Venenatis pulvinar a amet in, suspendisse vitae, posuere eu tortor et. Unc commodo, fermentum, mauris leo eget."}
                </Text>

                {/* Location */}
                <View style={{ marginBottom: 24 }}>
                  <Text style={{
                    color: '#9CA3AF',
                    fontSize: 14,
                    fontWeight: 'bold',
                    marginBottom: 4,
                  }}>
                    LOCATION
                  </Text>

                  <View style={{
                    borderRadius: 12,
                  }}>
                    <Text style={{
                      color: 'white',
                      fontSize: 16,
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
                      color: '#9CA3AF',
                      fontSize: 14,
                      fontWeight: 'bold',
                      marginBottom: 4,
                    }}>
                      PRICE
                    </Text>
                    <Text style={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                      RS. {selectedEvent.ticketprice || '17.60'}/person
                    </Text>
                  </View>
                </View>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 24,
                }}>
                  <View>
                    <Text style={{
                      color: '#9CA3AF',
                      fontSize: 14,
                      fontWeight: 'bold',
                      marginBottom: 1,
                    }}>
                      AVAILABLE TICKETS
                    </Text>
                    <Text style={{
                      color: 'white',
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                      {selectedEvent.ticketQuantity || 'Free'}
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
                  {selectedEvent.description}
                </Text>

                <Text style={{
                  color: '#E5E7EB',
                  fontSize: 16,
                  textAlign: 'center',
                  marginTop: 40,
                }}>
                  {selectedEvent.title}
                  {selectedEvent.description}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Quantity Selector */}
        <View style={{
          backgroundColor: '#111827',
          paddingHorizontal: 20,
          paddingVertical: 3,
        }}>
          <Text style={{
            color: '#9CA3AF',
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 12,
          }}>
            SELECT QUANTITY
          </Text>

          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#374151',
            borderRadius: 12,
            padding: 16,
            marginBottom: 16,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
              <TouchableOpacity
                onPress={decreaseQuantity}
                style={{
                  backgroundColor: ticketQuantity <= 1 ? '#4B5563' : COLORS.purple,
                  borderRadius: 8,
                  width: 36,
                  height: 36,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                disabled={ticketQuantity <= 1}
              >
                <Ionicons name="remove" size={20} color="white" />
              </TouchableOpacity>

              <Text style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                marginHorizontal: 20,
                minWidth: 30,
                textAlign: 'center',
              }}>
                {ticketQuantity}
              </Text>

              <TouchableOpacity
                onPress={increaseQuantity}
                style={{
                  backgroundColor: ticketQuantity >= (selectedEvent?.ticketQuantity || 10) ? '#4B5563' : COLORS.purple,
                  borderRadius: 8,
                  width: 36,
                  height: 36,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                disabled={ticketQuantity >= (selectedEvent?.ticketQuantity || 10)}
              >
                <Ionicons name="add" size={20} color="white" />
              </TouchableOpacity>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{
                color: '#9CA3AF',
                fontSize: 12,
              }}>
                Total Price
              </Text>
              <Text style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
              }}>
                RS. {totalPrice.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Buy Ticket Button */}
        <View style={{
          backgroundColor: '#111827',
          paddingHorizontal: 20,
          paddingBottom: 40,
        }}>
          <TouchableOpacity
            onPress={buyTicket}
            style={{
              backgroundColor: COLORS.purple,
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
              {saveLoading ? (
                "Processing..."
              ) : (
                `BUY ${ticketQuantity} TICKET${ticketQuantity > 1 ? 'S' : ''}`
              )}
            </Text>
            {!saveLoading && <Ionicons name="ticket-outline" size={20} color="white" />}
            {saveLoading && <Ionicons name="hourglass-outline" size={20} color="white" />}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventDetail;