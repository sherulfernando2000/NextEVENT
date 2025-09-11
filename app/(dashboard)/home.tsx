import React, { useState, useRef } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  ImageBackground,
  Dimensions,
  Animated,
  PanResponder,
  ScrollView,
} from "react-native";
import { McText, McAvatar, McIcon } from "@/constants/styled";
import { COLORS, dummyData, images, SIZES } from "@/constants";
import { icons } from "@/constants";
import moment from "moment";
import { useNavigation } from '@react-navigation/native';
import { Link } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient'; // Make sure to install this

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_WIDTH = 200;
const ITEM_MARGIN = 10;
const ITEM_TOTAL_WIDTH = ITEM_WIDTH + ITEM_MARGIN * 2;

const EventScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const featuredListRef = useRef(null);
  const navigation = useNavigation();

  const [events, setEvents] = useState([
    { id: "1", name: "Music Festival", date: "Dec 28", location: "Central Park" },
    { id: "2", name: "Tech Conference", date: "Jan 15", location: "Convention Center" },
    { id: "3", name: "Art Exhibition", date: "Dec 30", location: "Modern Art Museum" },
  ]);

  const filteredEvents = events.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // PanResponder for touch handling
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -50) {
          // Swipe left - go to next
          goToNextFeatured();
        } else if (gestureState.dx > 50) {
          // Swipe right - go to previous
          goToPreviousFeatured();
        }
      },
    })
  ).current;

  const goToNextFeatured = () => {
    if (currentFeaturedIndex < dummyData.Events.length - 1) {
      setCurrentFeaturedIndex(prev => prev + 1);
      featuredListRef.current?.scrollToIndex({
        index: currentFeaturedIndex + 1,
        animated: true,
      });
    }
  };

  const goToPreviousFeatured = () => {
    if (currentFeaturedIndex > 0) {
      setCurrentFeaturedIndex(prev => prev - 1);
      featuredListRef.current?.scrollToIndex({
        index: currentFeaturedIndex - 1,
        animated: true,
      });
    }
  };

  const _renderFeaturedItem = ({ item, index }: any) => {
    const inputRange = [
      (index - 1) * ITEM_TOTAL_WIDTH,
      index * ITEM_TOTAL_WIDTH,
      (index + 1) * ITEM_TOTAL_WIDTH,
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.9, 1.0, 0.9],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.7, 1.0, 0.7],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        style={{
          transform: [{ scale }],
          opacity,
          width: ITEM_WIDTH,
          marginHorizontal: ITEM_MARGIN,
        }}
      >
        <Link
          href={{
            pathname: `/event/${item.id}`,
          }}>
          <ImageBackground
            source={item.image}
            className="rounded-2xl bg-cover relative"
            style={{
              width: '100%',
              height: 200,
              justifyContent: 'flex-end',
              overflow: 'hidden',
            }}
          >

            <View className="absolute w-12 h-14 top-2 left-4 bg-white rounded-lg p-1 items-center justify-center shadow-md">
              <Text className="text-xs font-medium text-gray-600 ">
                {moment(item.startingTime, 'YYYY/MM/DD HH:mm A').format('MMM').toUpperCase()}
              </Text>

              <Text className="text-lg font-bold text-gray-600 ">
                {moment(item.startingTime, 'YYYY/MM/DD HH:mm A').format('DD').toUpperCase()}
              </Text>
            </View>

            <View className="bg-black bg-opacity-40 p-3">
              <McText h4 className="text-white">{item.title}</McText>
              <McText body6 className="text-gray-300">{item.startingTime}</McText>
            </View>
          </ImageBackground>
        </Link>
      </Animated.View>
    );
  };

  const handleRegisterAsSeller = () => {
    // Navigate to seller registration
    navigation.navigate('SellerRegistration'); // Update with your actual route name
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="flex-row justify-between p-4">
          <View>
            <McText body5 className="text-gray-400">Dec 25 9:10am</McText>
            <McText h1 className="text-white">Explore Events</McText>
          </View>
          <McAvatar source={images.avatar} />
        </View>

        {/* Search Bar Section */}
        <View className="px-4 pb-4">
          <View className="bg-gray-800 rounded-lg flex-row items-center px-3">
            <McIcon source={icons.search} size={20} tintColor={COLORS.gray} />
            <TextInput
              className="flex-1 text-white py-3 px-2"
              placeholder="Search events..."
              placeholderTextColor={COLORS.gray}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} className="p-2">
                <McIcon source={icons.close} size={16} tintColor={COLORS.gray} />
              </TouchableOpacity>
            )}
            <TouchableOpacity className="p-2">
              <McIcon source={icons.filter} size={20} tintColor={COLORS.gray} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Featured section with Swipeable Carousel */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center px-4 mb-2">
            <McText h5 className="text-gray-400">FEATURED EVENTS</McText>
            <View className="flex-row">
              <Text className="text-gray-400 text-sm">
                {currentFeaturedIndex + 1} / {dummyData.Events.length}
              </Text>
            </View>
          </View>

          <View {...panResponder.panHandlers}>
            <Animated.FlatList
              ref={featuredListRef}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16 }}
              keyExtractor={(item) => 'featured_' + item.id}
              data={dummyData.Events}
              renderItem={_renderFeaturedItem}
              snapToInterval={ITEM_TOTAL_WIDTH}
              decelerationRate="fast"
              snapToAlignment="center"
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: true }
              )}
              scrollEventThrottle={16}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(
                  event.nativeEvent.contentOffset.x / ITEM_TOTAL_WIDTH
                );
                setCurrentFeaturedIndex(newIndex);
              }}
            />
          </View>

          {/* Navigation Dots */}
          <View className="flex-row justify-center mt-4">
            {dummyData.Events.map((_, index) => (
              <View
                key={index}
                className={`w-2 h-2 rounded-full mx-1 ${index === currentFeaturedIndex ? 'bg-white' : 'bg-gray-600'
                  }`}
              />
            ))}
          </View>

          {/* Navigation Arrows */}
          <View className="flex-row justify-between items-center px-8 mt-4">
            <TouchableOpacity
              onPress={goToPreviousFeatured}
              disabled={currentFeaturedIndex === 0}
              className={`p-2 ${currentFeaturedIndex === 0 ? 'opacity-30' : 'opacity-100'}`}
            >
              <McIcon source={icons.left_arrow} size={24} tintColor={COLORS.white} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goToNextFeatured}
              disabled={currentFeaturedIndex === dummyData.Events.length - 1}
              className={`p-2 ${currentFeaturedIndex === dummyData.Events.length - 1 ? 'opacity-30' : 'opacity-100'}`}
            >
              <McIcon source={icons.right_arrow} size={24} tintColor={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Discount Banner Section */}
        <View className="px-4 mb-6">
          <LinearGradient
            colors={['#8B5CF6', '#FF8E53', '#8B5CF6']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              padding: 20,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <View className="bg-white bg-opacity-20 rounded-full px-3 py-1">
                    <Text className="text-white text-xs font-bold">SPECIAL OFFER</Text>
                  </View>
                </View>
                <McText h3 className="text-white font-bold mb-1">
                  Buy 2 Get 1 FREE
                </McText>
                <McText body5 className="text-white opacity-90 mb-3">
                  Purchase any two event tickets and get the third one absolutely free!
                </McText>
                <TouchableOpacity
                  className="bg-white rounded-full px-4 py-2 self-start"
                  onPress={() => {/* Handle offer claim */ }}
                >
                  <Text className="text-gray-800 font-semibold text-sm">Claim Offer</Text>
                </TouchableOpacity>
              </View>

              <View className="ml-4">
                <View className="bg-white bg-opacity-20 rounded-full w-16 h-16 items-center justify-center">
                  <Text className="text-white text-2xl">🎫</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Seller Registration Section */}
        <View className="px-4 mb-6">
          <View className="bg-gray-900 border border-gray-700 rounded-2xl p-6">
            <View className="items-center text-center">
              {/* Icon */}
              <View className="bg-[#8B5CF6] bg-opacity-20 rounded-full w-16 h-16 items-center justify-center mb-4"

              >
                <McIcon source={icons.user} size={28} tintColor="#4096FE" />
              </View>

              {/* Content */}
              <McText h4 className="text-white font-bold mb-2 text-center">
                Want to Host Events?
              </McText>
              <McText body4 className="text-gray-400 text-center mb-6 leading-6">
                Join our platform as an event organizer and start creating amazing experiences for your audience.
              </McText>

              {/* Features */}
              <View className="w-full mb-6">
                <View className="flex-row items-center mb-2">
                  <View className="w-2 h-2 bg-[#8B5CF6] rounded-full mr-3" />
                  <McText body6 className="text-gray-300 flex-1">Easy event management tools</McText>
                </View>
                <View className="flex-row items-center mb-2">
                  <View className="w-2 h-2 bg-[#8B5CF6] rounded-full mr-3" />
                  <McText body6 className="text-gray-300 flex-1">Secure payment processing</McText>
                </View>
                <View className="flex-row items-center">
                  <View className="w-2 h-2 bg-[#8B5CF6] rounded-full mr-3" />
                  <McText body6 className="text-gray-300 flex-1">Marketing and promotion support</McText>
                </View>
              </View>

              {/* Button */}
              <TouchableOpacity
                onPress={handleRegisterAsSeller}
                className="bg-blue-500 rounded-full px-8 py-4 w-full"
                style={{ backgroundColor: COLORS.purple }}
              >
                
                <Text className="text-white font-semibold text-center text-base">
                  Register as Event Organizer
                </Text>
              </TouchableOpacity>

              {/* Secondary text */}
              <McText body6 className="text-gray-500 text-center mt-3">
                Already registered? <Text className="text-[#8B5CF6]/70">Sign in here</Text>
              </McText>
            </View>
          </View>
        </View>

        {/* Bottom spacing */}
        <View className="pb-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventScreen;