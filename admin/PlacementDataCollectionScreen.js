import React, { useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Title, Divider, IconButton, Text } from 'react-native-paper';
import axios from 'axios';
import config from '../config';

const PlacementDataCollectionScreen = () => {
    const [year, setYear] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [collegeEmail, setCollegeEmail] = useState('');
    const [numberOfCompanies, setNumberOfCompanies] = useState('');
    const [departments, setDepartments] = useState([{ departmentName: '', companies: [{ companyName: '', avgPackage: '', status: '', totalPlaced: '' }] }]);

    const handleAddDepartment = () => {
        setDepartments([...departments, { departmentName: '', companies: [{ companyName: '', avgPackage: '', status: '', totalPlaced: '' }] }]);
    };

    const handleAddCompany = (deptIndex) => {
        const newDepartments = [...departments];
        newDepartments[deptIndex].companies.push({ companyName: '', avgPackage: '', status: '', totalPlaced: '' });
        setDepartments(newDepartments);
    };

    const handleInputChange = (deptIndex, companyIndex, field, value) => {
        const newDepartments = [...departments];
        if (field === 'departmentName') {
            newDepartments[deptIndex].departmentName = value;
        } else {
            newDepartments[deptIndex].companies[companyIndex][field] = value;
        }
        setDepartments(newDepartments);
    };

    const handleSubmit = () => {
        const data = {
            year: parseInt(year),
            collegeName,
            collegeEmail,
            numberOfCompanies: parseInt(numberOfCompanies),
            departments
        };

        axios.post(`${config.SERVER_IP}/api/addPlacementData`, data)
            .then(response => {
                alert('Data submitted successfully!');
            })
            .catch(error => {
                console.error('There was an error submitting the data!', error);
            });
    };

    return (
        <ScrollView style={styles.container}>
            <Card style={styles.card}>
                <Card.Content>
                    <Title style={styles.title}>Placement Data Collection</Title>
                    <Divider style={styles.divider} />
                    
                    <TextInput
                        label="Year"
                        value={year}
                        onChangeText={setYear}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.input}
                        theme={{ colors: { primary: '#6200ea' } }}
                    />
                    
                    <TextInput
                        label="College Name"
                        value={collegeName}
                        onChangeText={setCollegeName}
                        mode="outlined"
                        style={styles.input}
                        theme={{ colors: { primary: '#6200ea' } }}
                    />

                    <TextInput
                        label="College Email"
                        value={collegeEmail}
                        onChangeText={setCollegeEmail}
                        keyboardType="email-address"
                        mode="outlined"
                        style={styles.input}
                        theme={{ colors: { primary: '#6200ea' } }}
                    />

                    <TextInput
                        label="Number of Companies"
                        value={numberOfCompanies}
                        onChangeText={setNumberOfCompanies}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.input}
                        theme={{ colors: { primary: '#6200ea' } }}
                    />
                </Card.Content>
            </Card>

            {departments.map((department, deptIndex) => (
                <Card key={deptIndex} style={styles.departmentCard}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Department {deptIndex + 1}</Text>
                        <TextInput
                            label="Department Name"
                            value={department.departmentName}
                            onChangeText={(value) => handleInputChange(deptIndex, 0, 'departmentName', value)}
                            mode="outlined"
                            style={styles.input}
                            theme={{ colors: { primary: '#6200ea' } }}
                        />

                        {department.companies.map((company, companyIndex) => (
                            <Card key={companyIndex} style={styles.companyCard}>
                                <Card.Content>
                                    <Text style={styles.companyTitle}>Company {companyIndex + 1}</Text>
                                    <TextInput
                                        label="Company Name"
                                        value={company.companyName}
                                        onChangeText={(value) => handleInputChange(deptIndex, companyIndex, 'companyName', value)}
                                        mode="outlined"
                                        style={styles.input}
                                        theme={{ colors: { primary: '#6200ea' } }}
                                    />

                                    <TextInput
                                        label="Average Package (LPA)"
                                        value={company.avgPackage}
                                        onChangeText={(value) => handleInputChange(deptIndex, companyIndex, 'avgPackage', value)}
                                        keyboardType="numeric"
                                        mode="outlined"
                                        style={styles.input}
                                        theme={{ colors: { primary: '#6200ea' } }}
                                    />

                                    <TextInput
                                        label="Status"
                                        value={company.status}
                                        onChangeText={(value) => handleInputChange(deptIndex, companyIndex, 'status', value)}
                                        mode="outlined"
                                        style={styles.input}
                                        theme={{ colors: { primary: '#6200ea' } }}
                                    />

                                    <TextInput
                                        label="Total Placed"
                                        value={company.totalPlaced}
                                        onChangeText={(value) => handleInputChange(deptIndex, companyIndex, 'totalPlaced', value)}
                                        keyboardType="numeric"
                                        mode="outlined"
                                        style={styles.input}
                                        theme={{ colors: { primary: '#6200ea' } }}
                                    />
                                </Card.Content>
                            </Card>
                        ))}

                        <Button
                            mode="contained"
                            icon="plus"
                            onPress={() => handleAddCompany(deptIndex)}
                            style={styles.addButton}
                            contentStyle={styles.buttonContent}
                        >
                            Add Another Company
                        </Button>
                    </Card.Content>
                </Card>
            ))}

            <View style={styles.buttonContainer}>
                <Button
                    mode="contained"
                    icon="plus"
                    onPress={handleAddDepartment}
                    style={styles.addDepartmentButton}
                    contentStyle={styles.buttonContent}
                >
                    Add Another Department
                </Button>

                <Button
                    mode="contained"
                    onPress={handleSubmit}
                    style={styles.submitButton}
                    contentStyle={styles.buttonContent}
                >
                    Submit Data
                </Button>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    card: {
        marginBottom: 20,
        borderRadius: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#6200ea',
        marginBottom: 20,
        textAlign: 'center',
    },
    divider: {
        marginBottom: 20,
    },
    input: {
        marginBottom: 15,
    },
    departmentCard: {
        marginBottom: 20,
        borderRadius: 10,
    },
    companyCard: {
        marginBottom: 15,
        backgroundColor: '#e3f2fd',
        borderRadius: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#6200ea',
    },
    companyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#0288d1',
    },
    addButton: {
        backgroundColor: '#0288d1',
        borderRadius: 30,
        marginTop: 10,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    buttonContainer: {
        marginBottom: 30,
        marginTop: 10,
    },
    addDepartmentButton: {
        backgroundColor: '#7b1fa2',
        borderRadius: 30,
        marginBottom: 15, // Adding more margin below the add department button
    },
    submitButton: {
        backgroundColor: '#388e3c',
        borderRadius: 30,
        marginBottom: 30, // Adequate spacing between buttons and bottom of the screen
    },
});

export default PlacementDataCollectionScreen;
