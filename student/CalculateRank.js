import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import config from '../config';

const CalculateRank = () => {
    const [twelfthPercentage, setTwelfthPercentage] = useState('');
    const [gujcetPercentage, setGujcetPercentage] = useState('');
    const [suggestions, setSuggestions] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSuggestColleges = async () => {
        setLoading(true);
        try {
            const response = await fetch(`https://flask-app-2-5srx.onrender.com/api/suggest_colleges`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    twelfth_percentage: parseFloat(twelfthPercentage),
                    gujcet_percentage: parseFloat(gujcetPercentage),
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Network response was not ok');
            }

            const data = await response.json();
            setSuggestions(data);
        } catch (error) {
            Alert.alert('Error', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.label}>12th Board Percentage:</Text>
            <TextInput
                value={twelfthPercentage}
                onChangeText={setTwelfthPercentage}
                keyboardType="numeric"
                placeholder="Enter 12th percentage"
                style={styles.input}
            />
            <Text style={styles.label}>GUJCET Percentage:</Text>
            <TextInput
                value={gujcetPercentage}
                onChangeText={setGujcetPercentage}
                keyboardType="numeric"
                placeholder="Enter GUJCET percentage"
                style={styles.input}
            />

            {/* Suggest Colleges Button */}
            <TouchableOpacity style={styles.suggestButton} onPress={handleSuggestColleges}>
                <Text style={styles.suggestButtonText}>Suggest Colleges</Text>
            </TouchableOpacity>

            {/* Loading Spinner */}
            {loading && (
                <ActivityIndicator size="large" color="#6200EE" style={styles.loadingIndicator} />
            )}

            {/* Suggestions Section */}
            {suggestions && !loading && (
                <View style={styles.suggestionsContainer}>
                    <Text style={styles.suggestionText}>Predicted Rank: {suggestions.predicted_rank}</Text>
                    <Text style={styles.suggestionText}>Colleges:</Text>
                    <Text style={styles.suggestionText}>{suggestions.colleges}</Text>
                </View>
            )}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5', // light background like the image
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#6200EE', // purple color for labels
    },
    input: {
        borderWidth: 1,
        borderColor: '#6200EE',
        padding: 10,
        borderRadius: 10, // rounded input fields
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: 'white',
    },
    suggestButton: {
        backgroundColor: '#6200EE', // purple background for button
        padding: 15,
        borderRadius: 10, // rounded corners
        alignItems: 'center',
    },
    suggestButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loadingIndicator: {
        marginTop: 20,
    },
    suggestionsContainer: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
    },
    suggestionText: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default CalculateRank;
