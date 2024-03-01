// import React, { Component, Fragment } from 'react';
// import SearchableDropdown from 'react-native-searchable-dropdown';

// var items = [
//   {
//     id: 1,
//     name: 'JavaScript',
//   },
//   {
//     id: 2,
//     name: 'Java',
//   },
//   {
//     id: 3,
//     name: 'Ruby',
//   },
//   {
//     id: 4,
//     name: 'React Native',
//   },
//   {
//     id: 5,
//     name: 'PHP',
//   },
//   {
//     id: 6,
//     name: 'Python',
//   },
//   {
//     id: 7,
//     name: 'Go',
//   },
//   {
//     id: 8,
//     name: 'Swift',
//   },
// ];
// class SearchBarTest extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       selectedItems: [
//         {
//           id: 7,
//           name: 'Go',
//         },
//         {
//           id: 8,
//           name: 'Swift',
//         }
//       ]
//     }
//   }
//   render() {
//   return (
//         <Fragment>
//           {/* Multi */}
//           <SearchableDropdown
//             multi={true}
//             selectedItems={this.state.selectedItems}
//             onItemSelect={(item) => {
//               const items = this.state.selectedItems;
//               items.push(item)
//               this.setState({ selectedItems: items });
//             }}
//             containerStyle={{ padding: 5 }}
//             onRemoveItem={(item, index) => {
//               const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
//               this.setState({ selectedItems: items });
//             }}
//             itemStyle={{
//               padding: 10,
//               marginTop: 2,
//               backgroundColor: '#ddd',
//               borderColor: '#bbb',
//               borderWidth: 1,
//               borderRadius: 5,
//             }}
//             itemTextStyle={{ color: '#000' }}
//             itemsContainerStyle={{ maxHeight: 140 }}
//             items={items}
//             defaultIndex={2}
//             chip={true}
//             resetValue={false}
//             textInputProps={
//               {
//                 placeholder: "placeholder",
//                 underlineColorAndroid: "transparent",
//                 style: {
//                     padding: 12,
//                     borderWidth: 1,
//                     borderColor: '#ccc',
//                     borderRadius: 5,
//                     color:"#000"
//                 },
//                 onTextChange: text => alert(text)
//               }
//             }
//             listProps={
//               {
//                 nestedScrollEnabled: true,
//               }
//             }
//           />
//           {/* Single */}
//           {/* <SearchableDropdown
//             onItemSelect={(item) => {
//               const items = this.state.selectedItems;
//               items.push(item)
//               this.setState({ selectedItems: items });
//             }}
//             containerStyle={{ padding: 5 }}
//             onRemoveItem={(item, index) => {
//               const items = this.state.selectedItems.filter((sitem) => sitem.id !== item.id);
//               this.setState({ selectedItems: items });
//             }}
//             itemStyle={{
//               padding: 10,
//               marginTop: 2,
//               backgroundColor: '#ddd',
//               borderColor: '#bbb',
//               borderWidth: 1,
//               borderRadius: 5,
//             }}
//             itemTextStyle={{ color: '#222' }}
//             itemsContainerStyle={{ maxHeight: 140 }}
//             items={items}
//             defaultIndex={2}
//             resetValue={false}
//             textInputProps={
//               {
//                 placeholder: "placeholder",
//                 underlineColorAndroid: "transparent",
//                 style: {
//                     padding: 12,
//                     borderWidth: 1,
//                     borderColor: '#ccc',
//                     borderRadius: 5,
//                 },
//                 onTextChange: text => alert(text)
//               }
//             }
//             listProps={
//               {
//                 nestedScrollEnabled: true,
//               }
//             }
//         /> */}
//       </Fragment>
//   );
//   }
// }

// export default SearchBarTest


// import React, { useState } from 'react';
// import { View, TouchableOpacity, Text } from 'react-native';

// function DropdownComponent() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [selectedValue, setSelectedValue] = useState(null);
//   const options = ['Option 1', 'Option 2', 'Option 3'];

//   const toggleDropdown = () => {
//     setIsOpen(!isOpen);
//   };

//   const handleOptionSelect = (option) => {
//     setSelectedValue(option);
//     setIsOpen(false);
//   };

//   return (
//     <View style={{ position: 'relative' }}>
//       <TouchableOpacity onPress={toggleDropdown} style={{ padding: 10, borderWidth: 1 }}>
//         <Text>{selectedValue || 'Select an option'}</Text>
//       </TouchableOpacity>

//       {isOpen && (
//         <View style={{ position: 'absolute', top: 40, left: 0, right: 0, borderWidth: 1 }}>
//           {options.map((option) => (
//             <TouchableOpacity key={option} onPress={() => handleOptionSelect(option)}>
//               <Text style={{ padding: 10 }}>{option}</Text>
//             </TouchableOpacity>
//           ))}
//         </View>
//       )}
//     </View>
//   );
// }

// export default DropdownComponent;

// import React, { useRef, useState } from 'react';
// import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

// const Tabs = () => {
//   const tabsRef = useRef([]);
//   const [activeTab, setActiveTab] = useState(0);

//   const handleTabClick = (index) => {
//     setActiveTab(index);
//   };

//   const registerTabRef = (ref) => {
//     if (ref && !tabsRef.current.includes(ref)) {
//       tabsRef.current.push(ref);
//     }
//   };

//   const resetTabs = () => {
//     tabsRef.current.forEach((tabRef) => {
//       tabRef.setNativeProps({ style: styles.tab });
//     });
//   };

//   const showTabContent = () => {
//     resetTabs();
//     tabsRef.current[activeTab].setNativeProps({ style: styles.activeTab });
//   };

//   return (
//     <View>
//       <View style={styles.tabContainer}>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 0 ? styles.activeTab : null]}
//           onPress={() => handleTabClick(0)}
//           ref={registerTabRef}
//         >
//           <Text>Tab 1</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 1 ? styles.activeTab : null]}
//           onPress={() => handleTabClick(1)}
//           ref={registerTabRef}
//         >
//           <Text>Tab 2</Text>
//         </TouchableOpacity>
//         <TouchableOpacity
//           style={[styles.tab, activeTab === 2 ? styles.activeTab : null]}
//           onPress={() => handleTabClick(2)}
//           ref={registerTabRef}
//         >
//           <Text>Tab 3</Text>
//         </TouchableOpacity>
//       </View>
//       <View style={styles.tabContentContainer}>
//         <View style={styles.tabContent}>{activeTab === 0 && <Text>Content for Tab 1</Text>}</View>
//         <View style={styles.tabContent}>{activeTab === 1 && <Text>Content for Tab 2</Text>}</View>
//         <View style={styles.tabContent}>{activeTab === 2 && <Text>Content for Tab 3</Text>}</View>
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   tabContainer: {
//     flexDirection: 'row',
//     backgroundColor: '#f1f1f1',
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//   },
//   tab: {
//     flex: 1,
//     padding: 10,
//     alignItems: 'center',
//   },
//   activeTab: {
//     backgroundColor: '#ccc',
//   },
//   tabContentContainer: {
//     marginTop: 10,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//   },
//   tabContent: {
//     display: 'flex',
//     alignItems: 'center',
//   },
// });

// export default Tabs;



// import React, { useState, useRef } from 'react';
// import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
// import { WebView } from "react-native-webview";

// const BrowserTabs = () => {
//   const [tabs, setTabs] = useState([{ id: 1, url: 'https://example.com' }]);
//   const activeTabRef = useRef(1);

//   const addNewTab = () => {
//     const newTabId = tabs.length + 1;
//     setTabs([...tabs, { id: newTabId, url: 'https://example.com' }]);
//     activeTabRef.current = newTabId;
//   };

//   const switchTab = (tabId) => {
//     activeTabRef.current = tabId;
//   };

//   const closeTab = (tabId) => {
//     setTabs((prevTabs) => prevTabs.filter((tab) => tab.id !== tabId));
//     if (activeTabRef.current === tabId) {
//       activeTabRef.current = tabs[tabs.length - 2].id;
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <View style={styles.tabBar}>
//         {tabs.map((tab) => (
//           <TouchableOpacity
//             key={tab.id}
//             style={[
//               styles.tabButton,
//               tab.id === activeTabRef.current ? styles.activeTabButton : null,
//             ]}
//             onPress={() => switchTab(tab.id)}
//             onLongPress={() => closeTab(tab.id)}
//           >
//             <Text>{tab.id}</Text>
//           </TouchableOpacity>
//         ))}
//         <TouchableOpacity style={styles.addTabButton} onPress={addNewTab}>
//           <Text>Add New Tab</Text>
//         </TouchableOpacity>
//       </View>
//       <WebView
//         source={{ uri: tabs.find((tab) => tab.id === activeTabRef.current)?.url }}
//         style={styles.webView}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   tabBar: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#f0f0f0',
//     height: 40,
//   },
//   tabButton: {
//     paddingHorizontal: 16,
//     height: '100%',
//     justifyContent: 'center',
//   },
//   activeTabButton: {
//     backgroundColor: '#ffffff',
//   },
//   addTabButton: {
//     paddingHorizontal: 16,
//     height: '100%',
//     justifyContent: 'center',
//     borderLeftWidth: 1,
//     borderLeftColor: '#c0c0c0',
//   },
//   webView: {
//     flex: 1,
//   },
// });

// export default BrowserTabs;

// import React, { Component } from 'react';
// import {
//   StyleSheet,
//   Text,
//   View
// } from 'react-native';
// import CalendarPicker from 'react-native-calendar-picker';

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       selectedStartDate: null,
//     };
//     this.onDateChange = this.onDateChange.bind(this);
//   }

//   onDateChange(date) {
//     this.setState({
//       selectedStartDate: date,
//     });
//   }
//   render() {
//     const { selectedStartDate } = this.state;
//     const startDate = selectedStartDate ? selectedStartDate.toString() : '';
//     return (
//       <View style={styles.container}>
//         <CalendarPicker
//           onDateChange={this.onDateChange}
//         />

//         <View>
//           <Text>SELECTED DATE:{ startDate }</Text>
//         </View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#FFFFFF',
//     marginTop: 100,
//   },
// });

// import React, { useState } from 'react';
// import { View, Button } from 'react-native';
// import { Calendar, LocaleConfig } from 'react-native-calendars';
// import DateTimePickerModal from 'react-native-modal-datetime-picker';


// const App = () => {
//   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);

//   // Handle date selection
//   const handleDateSelect = (date) => {
//     setSelectedDate(date);
//     hideDatePicker();
//   };

//   // Show date picker
//   const showDatePicker = () => {
//     setDatePickerVisibility(true);
//   };

//   // Hide date picker
//   const hideDatePicker = () => {
//     setDatePickerVisibility(false);
//   };

//   return (
//     <View>
//       <Button title="Open Calendar" onPress={showDatePicker} />
//       <DateTimePickerModal
//         isVisible={isDatePickerVisible}
//         mode="date"
//         onConfirm={handleDateSelect}
//         onCancel={hideDatePicker}
//       />

//       <Calendar
//         onDayPress={(day) => {
//           setSelectedDate(day.dateString);
//           // You can perform any additional actions when a day is selected
//         }}
//       />
//     </View>
//   );
// };

// export default App;



import React, { useState, useCallback } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import MonthPicker from 'react-native-month-year-picker';

const App = () => {
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const showPicker = useCallback((value) => setShow(value), []);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;

      showPicker(false);
      setDate(selectedDate);
    },
    [date, showPicker],
  );
    console.log("date",date);
  return (
    <SafeAreaView>
      <Text style={{color:"#000"}}>Month Year Picker Example</Text>
      <Text style={{color:"#000"}}>{new Date(date).toLocaleString()}</Text>
      <TouchableOpacity onPress={() => showPicker(true)}>
        <Text style={{color:"#000"}}>OPEN</Text>
      </TouchableOpacity>
      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          minimumDate={new Date()}
          maximumDate={new Date(2025, 5)}
          // locale="ko"
        />
      )}
    </SafeAreaView>
  );
};

export default App;
