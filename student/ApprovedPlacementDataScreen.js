import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';
import config from '../config';

const ApprovedPlacementDataScreen = () => {
    const [placementData, setPlacementData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axios.get(`${config.SERVER_IP}/api/getApprovedPlacementData`)
            .then(response => {
                setPlacementData(response.data);
                setFilteredData(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching placement data:', error);
                setError('Error fetching placement data');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (searchTerm === '') {
            setFilteredData(placementData);
        } else {
            setFilteredData(
                placementData.filter(item =>
                    item.collegeName.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, placementData]);

    const handleSearch = (text) => {
        setSearchTerm(text);
    };

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>College Name</Text>
                <Text style={styles.tableHeader}>Year</Text>
                <Text style={styles.tableHeader}>Email</Text>
                <Text style={styles.tableHeader}>Number of Companies</Text>
            </View>
            <View style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.collegeName}</Text>
                <Text style={styles.tableCell}>{item.year}</Text>
                <Text style={styles.tableCell}>{item.collegeEmail}</Text>
                <Text style={styles.tableCell}>{item.numberOfCompanies}</Text>
            </View>
            <Text style={styles.subHeading}>Departments:</Text>
            {item.departments.map((dept, index) => (
                <View key={index} style={styles.departmentSection}>
                    <Text style={styles.subHeading}>- {dept.departmentName}</Text>
                    {dept.companies.map((company, idx) => (
                        <View key={idx} style={styles.companySection}>
                            <Text style={styles.companyInfo}>
                                • {company.companyName} - Avg Package: {company.avgPackage} LPA
                            </Text>
                            <Text style={styles.companyInfo}>
                                Total Placed: {company.totalPlaced}
                            </Text>
                        </View>
                    ))}
                </View>
            ))}
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#6200ea" />
                <Text style={styles.loadingText}>Loading data...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchBar}
                placeholder="Search by College Name"
                value={searchTerm}
                onChangeText={handleSearch}
            />
            {filteredData.length > 0 ? (
                <FlatList
                    data={filteredData}
                    renderItem={renderItem}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.listContainer}
                />
            ) : (
                <Text style={styles.noResultsText}>No results found</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f9fa', // Slightly different light background for modern look
    },
    searchBar: {
        height: 45,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        backgroundColor: '#fff', // White background for the search bar
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2,
    },
    listContainer: {
        paddingBottom: 20,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginBottom: 15,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 8,
        elevation: 4,
    },
    tableRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    tableHeader: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        fontSize: 16,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        color: '#666',
        fontSize: 14,
    },
    subHeading: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginVertical: 10,
    },
    departmentSection: {
        marginVertical: 10,
        paddingHorizontal: 10,
        borderLeftWidth: 4,
        borderLeftColor: '#6200ea', // Accent color for departments
    },
    companySection: {
        marginVertical: 6,
    },
    companyInfo: {
        fontSize: 14,
        color: '#555',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        fontSize: 16,
        color: 'red',
    },
    noResultsText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default ApprovedPlacementDataScreen;
