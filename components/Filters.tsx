import { categories } from '@/constants/data';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

const Filters = () => {
  const params = useLocalSearchParams<{ filter?: string }>();
  const [selectedCategory, setSelectedCategory] = useState(params.filter || 'All');

  const handleCategoryPress = (category: string) => {
    if (selectedCategory === category){
        setSelectedCategory('All');
        router.setParams({filter: 'All'});
        return;
    }

    setSelectedCategory(category);
    router.setParams({filter: category});
    

  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-3 mb-2"
    >
      <View className="flex flex-row px-4">
        {categories.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => handleCategoryPress(item.category)}
            className={`mr-4 px-4 py-2 rounded-full border ${
              selectedCategory === item.category
                ? 'bg-primary-300 border-primary-300'
                : 'bg-primary-100 border-primary-200'
            }`}
          >
            <Text
              className={`text-sm font-rubik-medium ${
                selectedCategory === item.category? 'text-white font-rubik-bold mt-0.5' : 'text-black-300 font-rubik'
              }`}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default Filters;
