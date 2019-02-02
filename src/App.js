import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import {View} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css';
import { View, Panel, PanelHeader, FormLayout, FormLayoutGroup, Input, Button } from '@vkontakte/vkui';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      access_token: "f4f51b591aba74b9f3e921fb762b0026af5a68fc34bf22f2a945190c904d7956cec515c978ad4a7c24ce5",
      user1: "121885036",
      user2: "144944981",
      common_friends: null
    }
    this.go = this.go.bind(this);
    this.test = this.test.bind(this);
  }
  test(){
    fetch('https://api.vk.com/method/friends.get?v=5.92'+
          '&access_token='+this.state.access_token+
          "&user_id"+this.state.user1, {mode: 'cors'})
    .then(response => response.json())
    .then(data => {
      console.log(data);
    })
  }
  go(){
    var all_friends = [];
    fetch('http://api.vk.com/method/friends.get?v=5.92'+
          '&access_token='+this.state.access_token+
          "&user_id"+this.state.user1, {mode: 'no-cors'})
    .then(response => response.json())
    .then(data => {
      for (var i = 0; i < data.response.items.length; i++) {
        all_friends.push(JSON.stringify(data.response.items[i]))
        if(i == data.response.items.length-1){
          fetch('https://api.vk.com/method/friends.get?v=5.92'+
                '&access_token='+this.state.access_token+
                "&user_id"+this.state.user2)
          .then(response => response.json())
          .then(data => {
            for (var i = 0; i < data.response.items.length; i++) {
              all_friends.push(JSON.stringify(data.response.items[i]))
              if(i == data.response.items.length-1){
                all_friends = all_friends.filter(function (elem, pos, arr) {
                    return pos !== arr.indexOf(elem) || pos !== arr.lastIndexOf(elem);
                });
                var unique1 = [...new Set(all_friends)];
                unique1.map(item =>
                  <p>item</p>
                )
                this.setState({
                  common_friends: unique1
                })
              }
            }
          })
        }
      }
    })
  }
  render() {
    return (
      <View activePanel="main">
      <Panel id="main">
        <PanelHeader>Поиск общих друзей</PanelHeader>
        <FormLayout>
          <Input type="text" top="Введите ваш access token" />
          <FormLayoutGroup top="Ссылки" bottom="Сюда необходимо ввести ссылки на страницы друзей, общих друзей которых необходимо получить">
            <Input type="text"/>
            <Input type="text"/>
          </FormLayoutGroup>
          <Button onClick={this.go} size="xl">Получить список</Button>
          <Button onClick={this.test} size="xl">Получить список</Button>
        </FormLayout>
        {this.state.go}
      </Panel>
    </View>
    );
  }
}

export default App;
