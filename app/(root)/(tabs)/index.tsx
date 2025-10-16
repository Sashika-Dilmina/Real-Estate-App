import { router, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Card } from "@/components/Cards";
import Filters from "@/components/Filters";
import NoResults from "@/components/NoResults";
import Search from "@/components/Search";
import icons from "@/constants/icons";

import { useGlobalContext } from "@/lib/global-provider";
import { useAppwrite } from "@/lib/useAppwrite";

const Home = () => {
  const { user } = useGlobalContext();
  const params = useLocalSearchParams<{ query?: string; filter?: string }>();

  // Fetch data with custom Appwrite hook
  const { data: properties, loading, refetch } = useAppwrite({
    filter: params.filter,
    query: params.query,
    limit: 6,
  });

  useEffect(() => {
    refetch({
      filter: params.filter,
      query: params.query,
      limit: 6,
    });
  }, [params.filter, params.query]);

  const handleCardPress = (id: string) => router.push(`/properties/${id}`);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={properties}
        numColumns={2}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <Card item={item} onPress={() => handleCardPress(item.$id)} />
        )}
        contentContainerClassName="pb-32"
        columnWrapperClassName="flex gap-5 px-5"
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          loading ? (
            <ActivityIndicator size="large" className="mt-5 text-primary-300" />
          ) : (
            <NoResults />
          )
        }
        ListHeaderComponent={() => (
          <View className="px-5 mt-5">
            {/* Header with user info */}
            <View className="flex flex-row items-center justify-between">
              <View className="flex flex-row items-center">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-12 h-12 rounded-full"
                />
                <View className="ml-2">
                  <Text className="text-xs text-black-100 font-rubik">
                    Good Morning
                  </Text>
                  <Text className="text-base text-black-300 font-rubik-medium">
                    {user?.name || "Guest"}
                  </Text>
                </View>
              </View>
              <Image source={icons.bell} className="w-6 h-6" />
            </View>

            {/* Search bar */}
            <Search />

            {/* Recommended section */}
            <View className="mt-5">
              <View className="flex flex-row items-center justify-between mb-2">
                <Text className="text-xl font-rubik-bold text-black-300">
                  Our Recommendation
                </Text>
                <TouchableOpacity>
                  <Text className="text-base font-rubik-bold text-primary-300">
                    See all
                  </Text>
                </TouchableOpacity>
              </View>
              <Filters />
            </View>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

export default Home;
