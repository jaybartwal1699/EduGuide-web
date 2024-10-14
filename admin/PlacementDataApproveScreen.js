import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { Button, Card, Divider } from 'react-native-paper';
import axios from 'axios';
import config from '../config';

const PlacementDataApproveScreen = () => {
    const [placementData, setPlacementData] = useState([]);

    useEffect(() => {
        // Fetch unapproved placement data from the backend
        axios.get(`${config.SERVER_IP}/api/getUnapprovedPlacementData`)
            .then(response => {
                setPlacementData(response.data);
            })
            .catch(error => {
                console.error('Error fetching placement data:', error);
                Alert.alert('Error', 'Failed to fetch placement data.');
            });
    }, []);

    const handleApprove = (id) => {
        // Approve the placement data
        axios.post(`${config.SERVER_IP}/api/approvePlacementData`, { id })
            .then(response => {
                Alert.alert('Success', response.data.message);
                // Remove the approved item from the state
                setPlacementData(placementData.filter(item => item._id !== id));
            })
            .catch(error => {
                console.error('Error approving placement data:', error);
                Alert.alert('Error', 'Failed to approve placement data.');
            });
    };

    const renderItem = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content>
                <View style={styles.tableRow}>
                    <Text style={styles.tableHeader}>College Name</Text>
                    <Text style={styles.tableHeader}>Year</Text>
                    <Text style={styles.tableHeader}>Email</Text>
                    <Text style={styles.tableHeader}>Companies</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.collegeName}</Text>
                    <Text style={styles.tableCell}>{item.year}</Text>
                    <Text style={styles.tableCell}>{item.collegeEmail}</Text>
                    <Text style={styles.tableCell}>{item.numberOfCompanies}</Text>
                </View>

                <Divider style={styles.divider} />

                <Text style={styles.subHeading}>Departments</Text>
                {item.departments.map((dept, index) => (
                    <View key={index} style={styles.departmentSection}>
                        <Text style={styles.departmentName}>- {dept.departmentName}</Text>
                        {dept.companies.map((company, idx) => (
                            <Text key={idx} style={styles.companyInfo}>
                                • {company.companyName} - Avg Package: {company.avgPackage} LPA
                            </Text>
                        ))}
                    </View>
                ))}

                <Button
                    mode="contained"
                    onPress={() => handleApprove(item._id)}
                    style={styles.approveButton}
                    contentStyle={styles.buttonContent}
                    labelStyle={styles.buttonLabel}
                >
                    Approve
                </Button>
            </Card.Content>
        </Card>
    );

    return (
        <FlatList
            data={placementData}
            renderItem={renderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.container}
            ListEmptyComponent={<Text style={styles.emptyMessage}>No data available for approval.</Text>}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        flexGrow: 1,
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 15,
        marginBottom: 20,
        borderRadius: 10,
        elevation: 3,
    },
    tableRow: {
        flexDirection: 'row',
        marginBottom: 10,
    },
    tableHeader: {
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#6200ea',
        fontSize: 16,
    },
    tableCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 14,
        color: '#555',
    },
    divider: {
        marginVertical: 10,
    },
    subHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#0288d1',
        marginBottom: 10,
    },
    departmentSection: {
        marginVertical: 10,
    },
    departmentName: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#7b1fa2',
    },
    companyInfo: {
        fontSize: 14,
        marginBottom: 5,
        color: '#333',
    },
    approveButton: {
        marginTop: 15,
        backgroundColor: '#4CAF50',
        borderRadius: 25,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 16,
    },
    emptyMessage: {
        textAlign: 'center',
        fontSize: 18,
        color: '#888',
        marginTop: 50,
    },
});

export default PlacementDataApproveScreen;
