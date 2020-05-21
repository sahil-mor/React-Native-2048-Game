import React, {Component} from 'react';
import {View, Text,StyleSheet,Button} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import { AntDesign } from '@expo/vector-icons';
export default class GameClone extends Component {
 
  constructor(props) {
    super(props);
    this.state = {
      myText: 'I\'m ready to get swiped!',
      gestureName: 'none',
      loading : true,
      backgroundColors : [  "#616C6F", "#74B9FF","#E83350", "#26ae60","#F4C724", "#2475B0","#EA425C", "#B83227","#4BCFFA", "#45CE30",
      "#F3CC79","#192A56","#487EB0" ],gameOver : false,iconName : "",numRows : 4
    };
  }

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
      alert("game over")
    }
    var randomIndex = Math.floor(Math.random() * indexes.length)
    randomIndex = indexes[randomIndex]
    return randomIndex
  }

  componentDidMount(){
    var values = [null]
    for(var i = 1; i <= 16 ; i++){
      values[i] = null ;
    }
    var randomIndex = this.returnIndexForNew(values)
    values[randomIndex] = 2
    this.setState({ positionValues : values , loading : false })
  }

  onSwipeUp(gestureState) {
    this.setState({myText: 'You swiped up!',iconName : "upcircle" });
    this.checkUpSwipe()
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
    var currentPositionNumber , newlyMerged = [] ,valueFoundBeforeTermination ;
    // console.log("left : ---------------")
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
              newlyMerged.push(check)
              // console.log("in if with check : " + check + " matched for position : " + currentPositionNumber)
            }else if( check + 1 != currentPositionNumber ) {
              values[check+1] = values[currentPositionNumber]
              values[currentPositionNumber] = null
              // console.log("in if with check : " + (check + 1) + " for position : " + currentPositionNumber)
            }
          }else{ // we need to +1
            if( check + 1 != currentPositionNumber ){
              values[check+1] = values[currentPositionNumber]
              values[currentPositionNumber] = null
              // console.log("in else with check : " + (check + 1 )+ " for position : " + currentPositionNumber)
            }
          }
        }else{}       
      }
    }
    var randomIndex = this.returnIndexForNew(values)
    values[randomIndex] = 2
    // console.log("new at : " + randomIndex)
    this.setState({ positionValues : values })
  }

  checkRightSwipe = () => {
    var values = this.state.positionValues
    var currentPositionNumber ;
    var check,valueFoundBeforeTermination;
    var newlyMerged = []
    var numRow = this.state.numRows
    // console.log("right-----------------------")
    for(var rowNumber = 0 ; rowNumber < numRow ; rowNumber++){
      for(var boxNumber = numRow - 1 ; boxNumber >= 1 ; boxNumber--){
        currentPositionNumber = rowNumber * numRow + boxNumber
        if( values[currentPositionNumber] != null ){
          valueFoundBeforeTermination = false;
          for(check = currentPositionNumber + 1 ; check % numRow != 1; check++ ){
            if( values[check] != null ){
              valueFoundBeforeTermination = true
              // console.log("loop breaks")
              break;
            }
          }
          if(valueFoundBeforeTermination){ //if loop stopped for which value of check
            if( values[check] == values[currentPositionNumber] && !newlyMerged.includes(check) ){
              values[check] *= 2
              values[currentPositionNumber] = null
              newlyMerged.push(check)
            }else{ //if values are not equal -> just make currentPosition to check-1
                if(check-1 != currentPositionNumber){
                  values[check-1] = values[currentPositionNumber]
                  values[currentPositionNumber] = null 
                }
            }
            // console.log(check + " is check for in if position : " + currentPositionNumber)
          }else{ // loop terminates -> then check will be pointing to what -> pointing to 1 more so -> make it to check - 1
            values[check-1] = values[currentPositionNumber]
            values[currentPositionNumber] = null
            // console.log(check + " is check for in else position  : " + currentPositionNumber)
          }
        }else{
          //value is null
        }
      }
    }
    var randomIndex = this.returnIndexForNew(values)
    values[randomIndex] = 2
    // console.log("new at : " + randomIndex)
    this.setState({ positionValues : values })
  }

  checkUpSwipe = () => {
    var values = this.state.positionValues
    var numRow = this.state.numRows
    var currentPositionNumber ;
    var check,valueFoundBeforeTermination,positionToBeChecked;
    var newlyMerged = []
    // console.log("right-----------------------")
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
              newlyMerged.push(pos2)
              // console.log("in if : check(row) : " + pos2 + " matched with pos " + currentPositionNumber )
            }else if( (pos2 + numRow ) != currentPositionNumber ) {
              values[pos2+numRow] = values[currentPositionNumber]
              values[currentPositionNumber] = null
              // console.log("in if : check(row) : " + (pos2 + numRow ) + " for pos " + currentPositionNumber )
            }
          }else{ //loop completes itself -> need to add 1 to get correctPosition
            var pos2 = ( check + 1 ) * numRow + boxNumber
            if(pos2 != currentPositionNumber){
              values[pos2] = values[currentPositionNumber]
              values[currentPositionNumber] = null
              // console.log("in else : positionToWorkWith :  " + (pos2) + " for pos : " + currentPositionNumber)
            }
          }
        }else{

        }
      }
    }
    var randomIndex = this.returnIndexForNew(values)
    values[randomIndex] = 2
    // console.log("new at : " + randomIndex)
    this.setState({ positionValues : values })
  }

  checkDownSwipe = () => {
    var values = this.state.positionValues
    var numRow = this.state.numRows
    var currentPositionNumber ;
    var check,valueFoundBeforeTermination,positionToBeChecked;
    var newlyMerged = []
    // console.log("down-----------------------")
    for(var rowNumber = numRow - 2 ; rowNumber >= 0 ; rowNumber--){
      for(var boxNumber = 1 ; boxNumber <= numRow ; boxNumber++){
        currentPositionNumber = rowNumber * numRow + boxNumber
        //for value of check -> we need same boxNumber but for different rows
        if(values[currentPositionNumber] != null){
          console.log("down swipe for : " + currentPositionNumber )
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
              newlyMerged.push(pos2)
              console.log("in if : check : " + pos2 + " matched for position : " + currentPositionNumber)
            }else if( pos2 - numRow != currentPositionNumber ){
              values[pos2-numRow] = values[currentPositionNumber]
              values[currentPositionNumber] = null
              console.log("in if : check : " + (pos2 - numRow) + " for position : " + currentPositionNumber)
            }
          }else{
            var pos2 = (check - 1 ) * numRow + boxNumber
            if( pos2 != currentPositionNumber ){
              values[pos2] = values[currentPositionNumber]
              values[currentPositionNumber] = null
              console.log("in else : check : " + pos2 + " for position : " + currentPositionNumber)
            }
          }
        }else{

        }
      }
    }
    console.log( "values here are : " + values )
    var randomIndex = this.returnIndexForNew(values)
    values[randomIndex] = 2
    // console.log("new at : " + randomIndex)
    this.setState({ positionValues : values })
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
        <View style={[styles.eachBox,{ backgroundColor : Colors[values[0].exponent] }]}>
          <Text style={styles.boxText}> { values[0].value } </Text>
        </View>
        <View style={[styles.eachBox,{ backgroundColor : Colors[values[1].exponent] }]}>
          <Text style={styles.boxText}> { values[1].value } </Text>
        </View>
        <View style={[styles.eachBox,{ backgroundColor : Colors[values[2].exponent] }]}>
          <Text style={styles.boxText}> { values[2].value } </Text>
        </View>
        <View style={[styles.eachBox,{ backgroundColor : Colors[values[3].exponent] }]}>
          <Text style={styles.boxText}> { values[3].value } </Text>
        </View>
        {/* <View style={[styles.eachBox,{ backgroundColor : Colors[values[4].exponent] }]}>
          <Text style={styles.boxText}> { values[4].value } </Text>
        </View> */}
      </View>
    )
  }

  render() {
 
    const config = {
      velocityThreshold: 0.01,
      directionalOffsetThreshold: 40
    };
 
    if(this.state.loading){
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
            <Text style={styles.myText}> {this.state.myText} </Text>
            <AntDesign name={this.state.iconName} size={40} color="#0ABDE3" />
          </View>
      </GestureRecognizer>
    );
  }
}

const styles = StyleSheet.create({
  container : {
    flex: 1,justifyContent : "center",flexDirection : "column",backgroundColor : "#EAF0F1"
  },
  top : {
    flex : 2,justifyContent : "center",alignItems : "center"
  },
  middle : {
    flex : 6,backgroundColor : "#2F363F"
  },
  box : {
    flex : 1,flexDirection : "column",borderWidth : 2,borderColor : "#6ab04c"
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
    fontSize : 28,color : "white"
  },
  topText : {
    fontSize : 35,
  },
  myText : {
    fontSize : 30
  }
})