import React, {Component, useRef } from 'react';
import {View, Text,StyleSheet,Alert} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { AntDesign,FontAwesome } from '@expo/vector-icons';
import {Animated} from "react-native";
import * as Font from 'expo-font'

const FadeInView = (props) => {
  const fadeAnim = useRef(new Animated.Value(0)).current  // Initial value for opacity: 0
  React.useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: 1,
        duration: 500,
      }
    ).start();
  }, [])
  return (
    <Animated.View                 // Special animatable View
      style={{
        ...props.style,
        opacity: fadeAnim,  
        opacity: fadeAnim, // Binds directly
    transform: [{
      translateY: fadeAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [100, 0]  // 0 : 150, 0.5 : 75, 1 : 0
      }),
    }],       // Bind opacity to animated value
      }}
    >
      {props.children}
    </Animated.View>
  );
}

export default class GameClone extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      myText: 'I\'m ready to get swiped!',
      gestureName: 'none',
      loading : true,
      backgroundColors : [  "#616C6F", "#74B9FF","#E83350", "#26ae60","#F4C724", "#2475B0","#EA425C", "#B83227","#4BCFFA", "#45CE30",
      "#F3CC79","#192A56","#487EB0" ],gameOver : false,iconName : "",numRows : 4,
      fadeValue: new Animated.Value(0),score : 0,fontLoaded : false,
    
    };
  }

  _start = () => {
    Animated.timing(this.state.fadeValue, {
      toValue: 1,
      duration: 1000
    }).start();
  };

  returnIndexForNew = values => {
    var indexes = []
    var i = 0;
    values.forEach( eachValue => {
      if(eachValue == null && i != 0){
        indexes.push(i)
      }
      i++;
    } )
    if(indexes.length == 0){
      this.setState({ gameOver : true })
      Alert.alert(
        'Game Over!!!',
        `Your score is ${this.state.score} `
      )
      this.componentDidMount(tru)
    }
    var randomIndex = Math.floor(Math.random() * indexes.length)
    randomIndex = indexes[randomIndex]
    this._start();
    return randomIndex
  }

  componentDidMount(){
    var values = [null]
    for(var i = 1; i <= 16 ; i++){
      values[i] = null;
    }
    var randomIndex = this.returnIndexForNew(values)
    values[randomIndex] = 2
    this.setState({ 
      positionValues : values ,
      loading : false, score : 0 })
    this.loadFonts()
  }

  loadFonts = async() => {
    await Font.loadAsync({
      'Satisfy' : require("./assets/fonts/Satisfy-Regular.ttf"),
      'Caveat' : require("./assets/fonts/Caveat-Regular.ttf"),
    })
    this.setState({ fontLoaded : true })
  }

  onSwipeUp(gestureState) {
    this.setState({myText: 'You swiped up!',iconName : "upcircle" });
    this.checkUpSwipe();
  }
 
  onSwipeDown(gestureState) {
    this.setState({myText: 'You swiped down!',iconName : "downcircle" });
    this.checkDownSwipe()
  }
 
  onSwipeLeft(gestureState) {
    this.setState({myText: 'You swiped left!',iconName : "leftcircle" });
    this.checkLeftSwipe()
  }
 
  onSwipeRight(gestureState) {
    this.setState({myText: 'You swiped right!',iconName : "rightcircle"});
    this.checkRightSwipe()
  }
 
  onSwipe(gestureName, gestureState) {
    const {SWIPE_UP, SWIPE_DOWN, SWIPE_LEFT, SWIPE_RIGHT} = swipeDirections;
    this.setState({gestureName: gestureName});
    switch (gestureName) {
      case SWIPE_UP:
        this.setState({backgroundColor: '#E44236'});
        break;
      case SWIPE_DOWN:
        this.setState({backgroundColor: '#E74292'});
        break;
      case SWIPE_LEFT:
        this.setState({backgroundColor: '#6ab04c'});
        break;
      case SWIPE_RIGHT:
        this.setState({backgroundColor: '#99AAAB'});
        break;
    }
  }

  checkLeftSwipe = () => {
    var values = this.state.positionValues
    var numRow = this.state.numRows
    var score = this.state.score;
    var currentPositionNumber , newlyMerged = [] ,valueFoundBeforeTermination ;
    var check;
    for(var rowNumber = 0 ; rowNumber < numRow ; rowNumber++){
      for(var boxNumber = 2 ; boxNumber <= numRow ; boxNumber++){
        currentPositionNumber = rowNumber * numRow + boxNumber
        if(values[currentPositionNumber] != null){
          valueFoundBeforeTermination = false
          for(check = currentPositionNumber - 1 ; check % numRow != 0 ; check--){
            if(values[check] != null){
              valueFoundBeforeTermination = true;
              break;
            }
          }
          if(valueFoundBeforeTermination){
            if( values[check] == values[currentPositionNumber] && !newlyMerged.includes(check) ){
              values[check] *= 2
              values[currentPositionNumber] = null
              score += values[check]
              newlyMerged.push(check)
            }else if( check + 1 != currentPositionNumber ) {
              values[check+1] = values[currentPositionNumber]
              values[currentPositionNumber] = null
            }
          }else{ // we need to +1
            if( check + 1 != currentPositionNumber ){
              values[check+1] = values[currentPositionNumber]
              values[currentPositionNumber] = null
            }
          }
        }else{}       
      }
    }
    var randomIndex = this.returnIndexForNew(values)
    values[randomIndex] = 2
    this.setState({ positionValues : values, score })
  }

  checkRightSwipe = () => {
    var values = this.state.positionValues
    var currentPositionNumber ;
    var check,valueFoundBeforeTermination;
    var newlyMerged = []
    var numRow = this.state.numRows
    var score = this.state.score
    for(var rowNumber = 0 ; rowNumber < numRow ; rowNumber++){
      for(var boxNumber = numRow - 1 ; boxNumber >= 1 ; boxNumber--){
        currentPositionNumber = rowNumber * numRow + boxNumber
        if( values[currentPositionNumber] != null ){
          valueFoundBeforeTermination = false;
          for(check = currentPositionNumber + 1 ; check % numRow != 1; check++ ){
            if( values[check] != null ){
              valueFoundBeforeTermination = true
              break;
            }
          }
          if(valueFoundBeforeTermination){ //if loop stopped for which value of check
            if( values[check] == values[currentPositionNumber] && !newlyMerged.includes(check) ){
              values[check] *= 2
              values[currentPositionNumber] = null
              score += values[check]
              newlyMerged.push(check)
            }else{ //if values are not equal -> just make currentPosition to check-1
                if(check-1 != currentPositionNumber){
                  values[check-1] = values[currentPositionNumber]
                  values[currentPositionNumber] = null 
                }
            }
          }else{ // loop terminates -> then check will be pointing to what -> pointing to 1 more so -> make it to check - 1
            values[check-1] = values[currentPositionNumber]
            values[currentPositionNumber] = null
          }
        }else{
          //value is null
        }
      }
    }
    var randomIndex = this.returnIndexForNew(values)
    values[randomIndex] = 2
    this.setState({ positionValues : values ,score })
  }

  checkUpSwipe = () => {
    var values = this.state.positionValues
    var numRow = this.state.numRows
    var currentPositionNumber ;
    var check,valueFoundBeforeTermination,positionToBeChecked;
    var newlyMerged = [];
    var score = this.state.score
    for(var rowNumber = 1 ; rowNumber < numRow ; rowNumber++){
      for(var boxNumber = 1 ; boxNumber <= numRow ; boxNumber++){
        currentPositionNumber = rowNumber * numRow + boxNumber
        //for value of check -> we need same boxNumber but for different rows
        if(values[currentPositionNumber] != null){
          valueFoundBeforeTermination = false
          for(check = rowNumber - 1 ; check >= 0 ; check-- ){
            positionToBeChecked = check * numRow + boxNumber
            if( values[positionToBeChecked] != null ){
              valueFoundBeforeTermination = true;
              break;
            }
          }
          if(valueFoundBeforeTermination){ // loop has been stopped before completion 
            var pos2 = check * numRow + boxNumber
            if( values[pos2] == values[currentPositionNumber] && !newlyMerged.includes(pos2) ){
              values[pos2] *= 2;
              values[currentPositionNumber] = null
              score += values[pos2]
              newlyMerged.push(pos2)
            }else if( (pos2 + numRow ) != currentPositionNumber ) {
              values[pos2+numRow] = values[currentPositionNumber]
              values[currentPositionNumber] = null
            }
          }else{ //loop completes itself -> need to add 1 to get correctPosition
            var pos2 = ( check + 1 ) * numRow + boxNumber
            if(pos2 != currentPositionNumber){
              values[pos2] = values[currentPositionNumber]
              values[currentPositionNumber] = null
            }
          }
        }else{

        }
      }
    }
    var randomIndex = this.returnIndexForNew(values)
    values[randomIndex] = 2
    this.setState({ positionValues : values , score })
  }

  checkDownSwipe = () => {
    var values = this.state.positionValues
    var numRow = this.state.numRows
    var currentPositionNumber ;
    var check,valueFoundBeforeTermination,positionToBeChecked;
    var newlyMerged = []
    var score = this.state.score
    for(var rowNumber = numRow - 2 ; rowNumber >= 0 ; rowNumber--){
      for(var boxNumber = 1 ; boxNumber <= numRow ; boxNumber++){
        currentPositionNumber = rowNumber * numRow + boxNumber
        //for value of check -> we need same boxNumber but for different rows
        if(values[currentPositionNumber] != null){  
          valueFoundBeforeTermination = false
          for( check = rowNumber + 1 ; check < numRow ; check++ ){
            positionToBeChecked = check * numRow + boxNumber
            if( values[positionToBeChecked] != null ){
              valueFoundBeforeTermination = true;
              break;
            }
          }
          if(valueFoundBeforeTermination){
            var pos2 = check * numRow + boxNumber
            if( values[pos2] == values[currentPositionNumber] && !newlyMerged.includes(pos2) ){
              values[pos2] *= 2
              values[currentPositionNumber] = null
              score += values[pos2]
              newlyMerged.push(pos2)
            }else if( pos2 - numRow != currentPositionNumber ){
              values[pos2-numRow] = values[currentPositionNumber]
              values[currentPositionNumber] = null
            }
          }else{
            var pos2 = (check - 1 ) * numRow + boxNumber
            if( pos2 != currentPositionNumber ){
              values[pos2] = values[currentPositionNumber]
              values[currentPositionNumber] = null
            }
          }
        }else{

        }
      }
    }
    var randomIndex = this.returnIndexForNew(values)
    values[randomIndex] = 2
    this.setState({ positionValues : values , score })
  }

  returnRow = rowNumber => {
    var val = this.state.positionValues
    var numRow = this.state.numRows
    var Colors = this.state.backgroundColors
    var values = [];
    for(var i = 1 ; i <= numRow ; i++){
      values.push({
        value :  val[ rowNumber * numRow + i ],
        exponent : Math.log(val[ rowNumber * numRow + i ])/Math.log(2)
      })
    }
    return(
      <View style={styles.row}>
        <Animated.View
        style={[{
          opacity: this.state.fadeValue,
        },styles.row]}
        >
          <View style={[styles.eachBox,{ backgroundColor : Colors[values[0].exponent] }]}>
            <FadeInView position={(rowNumber * numRow + 1)} >
              <Text style={styles.boxText}> { values[0].value } </Text>
            </FadeInView>        
          </View>
          <View style={[styles.eachBox,{ backgroundColor : Colors[values[1].exponent] }]}>
            <FadeInView position={(rowNumber * numRow + 2)}>
              <Text style={styles.boxText}> { values[1].value } </Text>
            </FadeInView>
          </View>
          <View style={[styles.eachBox,{ backgroundColor : Colors[values[2].exponent] }]}>
           <FadeInView position={(rowNumber * numRow + 3)} >
              <Text style={styles.boxText}> { values[2].value } </Text>
            </FadeInView>        
          </View>
          <View style={[styles.eachBox,{ backgroundColor : Colors[values[3].exponent] }]}>
           <FadeInView position={(rowNumber * numRow + 4)} >
              <Text style={styles.boxText}> { values[3].value } </Text>
            </FadeInView>
          </View>
        </Animated.View>
      </View>
    )
  }

  render() {
 
    const config = {
      velocityThreshold: 0.01,
      directionalOffsetThreshold: 40
    };
 
    if(this.state.loading || !this.state.fontLoaded){
      return(
        <Text> wait</Text> 
      )
    }

    return (
      <GestureRecognizer
        onSwipe={(direction, state) => this.onSwipe(direction, state)}
        onSwipeUp={(state) => this.onSwipeUp(state)}
        onSwipeDown={(state) => this.onSwipeDown(state)}
        onSwipeLeft={(state) => this.onSwipeLeft(state)}
        onSwipeRight={(state) => this.onSwipeRight(state)}
        config={config}
        style={styles.container}
        >
          <View style={styles.top}>
              <Text style={styles.topText}> Match And Win </Text>
              <Text style={styles.score}> SCORE : {this.state.score} </Text>
          </View>
          <View style={styles.middle}>
            <View style={styles.box}>
              {this.returnRow(0)}
              {this.returnRow(1)}
              {this.returnRow(2)}
              {this.returnRow(3)}
              {/* {this.returnRow(4)} */}
            </View>
          </View>
          <View style={styles.bottom}>
          <FadeInView>
            <Text style={styles.myText}> {this.state.myText} </Text>
          </FadeInView>
            { this.state.iconName == "" ?
                <FontAwesome name="hand-stop-o" size={24} color="#EAF0F1" /> :
                <AntDesign name={this.state.iconName} size={30} color="#EAF0F1" />
            }
          </View>
          
      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,justifyContent : "center",flexDirection : "column",backgroundColor : "#777E8B",
  },
  top : {
    flex : 2,justifyContent : "center",alignItems : "center"
  },
  middle : {
    flex : 6,backgroundColor : "#2F363F"
  },
  box : {
    flex : 1,flexDirection : "column",borderWidth : 2,borderColor : "#6ab04c",backgroundColor : "#EAF0F1"
  },
  bottom : {
    flex : 2, alignItems : "center",justifyContent : "center",flexDirection : "row"
  },
  row : {
    flex : 1, flexDirection : "row"
  },
  eachBox : {
    flex : 1,borderWidth : 1,borderColor : "black",alignItems : "center",justifyContent : "center",borderRadius : 50
  },
  boxText : {
    fontSize : 28,color : "#EAF0F1",fontFamily : "Satisfy"
  },
  topText : {
    fontSize : 35,color : "#EAF0F1",fontFamily : "Satisfy",textDecorationLine : "underline"
  },
  myText : {
    fontSize : 30,color : "#EAF0F1",fontFamily : "Caveat"
  },
  score : {
    fontSize : 20,position : "absolute",right : 20,top : 120,color : "#EAF0F1",backgroundColor : "#E8290B",borderRadius : 20,
    fontFamily : "Caveat"
  }
})