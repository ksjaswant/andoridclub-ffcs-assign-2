import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  TextInput,
  Alert,
  ToastAndroid,
} from "react-native";

const API_BASE_URL = "https://dummy.restapiexample.com/api/v1";

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [newEmployeeName, setNewEmployeeName] = useState("");
  const [newEmployeeSalary, setNewEmployeeSalary] = useState("");
  const [newEmployeeAge, setNewEmployeeAge] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();
      setEmployees(data.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const renderEmployeeItem = ({ item }) => (
    <TouchableOpacity
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        backgroundColor: "#0F0F0F",
        marginVertical: 5,
      }}
      onPress={() => fetchEmployee(item.id)}
    >
      <View>
        <Text style={{ fontWeight: "bold", color: "#fff" }}>
          {item.employee_name}
        </Text>
        <Text style={{ color: "#fff" }}>Salary: {item.employee_salary}</Text>
        <Text style={{ color: "#fff" }}>Age: {item.employee_age}</Text>
      </View>
      <Button
        title="Delete"
        onPress={() => handleDeleteEmployee(item.id)}
        color="#FF0000"
      />
    </TouchableOpacity>
  );

  const fetchEmployee = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/employee/${id}`);
      const data = await response.json();
      console.log("Employee details:", data);
      setSelectedEmployeeId(id);
      setNewEmployeeName(data.employee_name);
      setNewEmployeeSalary(String(data.employee_salary));
      setNewEmployeeAge(String(data.employee_age));
    } catch (error) {
      console.error("Error fetching employee details:", error);
    }
  };

  const createEmployee = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newEmployeeName,
          salary: newEmployeeSalary,
          age: newEmployeeAge,
        }),
      });
      const data = await response.json();
      console.log("Created employee:", data);
      setNewEmployeeName("");
      setNewEmployeeSalary("");
      setNewEmployeeAge("");
      ToastAndroid.show("Employee created successfully!", ToastAndroid.SHORT);
      fetchEmployees();
    } catch (error) {
      console.error("Error creating employee:", error);
    }
  };

  const updateEmployee = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/update/${selectedEmployeeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newEmployeeName,
            salary: newEmployeeSalary,
            age: newEmployeeAge,
          }),
        }
      );
      const data = await response.json();
      console.log("Updated employee:", data);
      setSelectedEmployeeId(null);
      setNewEmployeeName("");
      setNewEmployeeSalary("");
      setNewEmployeeAge("");
      ToastAndroid.show("Employee updated successfully!", ToastAndroid.SHORT);
      fetchEmployees();
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  const deleteEmployee = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();
      console.log("Deleted employee:", data);
      ToastAndroid.show("Employee deleted successfully!", ToastAndroid.SHORT);
      fetchEmployees();
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  const handleDeleteEmployee = (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this employee?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => deleteEmployee(id) },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={{ flex: 1, paddingTop: 50, backgroundColor: "#000" }}>
      <View style={{ marginHorizontal: 20, height: 250 }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 10,
            color: "#FF00FF",
          }}
        >
          {selectedEmployeeId ? "Update Employee:" : "Create New Employee:"}
        </Text>
        <TextInput
          style={{
            marginBottom: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            color: "#fff",
          }}
          placeholder="Name"
          placeholderTextColor="#fff"
          value={newEmployeeName}
          onChangeText={(text) => setNewEmployeeName(text)}
        />
        <TextInput
          style={{
            marginBottom: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            color: "#fff",
          }}
          placeholder="Salary"
          placeholderTextColor="#fff"
          value={newEmployeeSalary}
          onChangeText={(text) => setNewEmployeeSalary(text)}
        />
        <TextInput
          style={{
            marginBottom: 10,
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            color: "#fff",
          }}
          placeholder="Age"
          placeholderTextColor="#fff"
          value={newEmployeeAge}
          onChangeText={(text) => setNewEmployeeAge(text)}
        />
        {selectedEmployeeId ? (
          <Button title="Update" onPress={updateEmployee} color="#FF00FF" />
        ) : (
          <Button title="Create" onPress={createEmployee} color="#FF00FF" />
        )}
      </View>
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10,
            color: "#FF00FF",
          }}
        >
          Employee List
        </Text>
        <FlatList
          data={employees}
          renderItem={renderEmployeeItem}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

export default EmployeePage;
