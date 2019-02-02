import React, { Component } from 'react';
// import logo from './logo.svg';
import './App.css';
// import {View} from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css';
import { View, Panel, PanelHeader, FormLayout, FormLayoutGroup, Input, Button, Alert, List, ListItem, Avatar, Group, ScreenSpinner } from '@vkontakte/vkui';
const VK = window.VK;

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user1: "",
      user2: "",
      common_friends: null,
      popout: null,
      some: ''
    }
    this.test = this.test.bind(this);
    this.auth = this.auth.bind(this);
    this.input = React.createRef();
    VK.Auth.getLoginStatus((data) => {
      if(data.status == 'connected'){
        this.setState({
          now_page: <FormLayout>
              <FormLayoutGroup top="Ссылки" bottom="Сюда необходимо ввести ссылки на страницы друзей в формате 'https://vk.com/aplinxy9plin', общих друзей которых необходимо получить">
                <Input onChange={evt => this.setState({user1: evt.target.value})} type="text"/>
                <Input onChange={evt => this.setState({user2: evt.target.value})} type="text"/>
              </FormLayoutGroup>
              <Button onClick={this.test} size="xl">Получить список</Button>
            </FormLayout>
        })
      }else{
        this.setState({
          now_page: <Group><Button onClick={this.auth} size="xl" level="commerce">Авторизоваться</Button></Group>
        })
      }
    })
  }
  test(){
    var user1 = this.state.user1,
        user2 = this.state.user2;
    console.log(user1, user2);
    var this1 = this;
    var tmp = user1.split("https://vk.com/"); user1 = tmp[1];
    tmp = user2.split("https://vk.com/"); user2 = tmp[1];
    this.setState({ popout: <ScreenSpinner /> });
    if(user1 !== undefined && user2 !== undefined && user1 !== '' && user2 !== '' && user1 !== user2){
      VK.api("users.get", {"user_ids": user1+","+user2,"v":"5.73"}, function (users) {
        var all_friends = [];
        user1 = users.response[0].id; user2 = users.response[1].id;
        VK.api("friends.get", {"user_id": user1, "fields": "city,photo_200", "v":"5.73"}, function (data) {
          for (var i = 0; i < data.response.items.length; i++) {
            all_friends.push(JSON.stringify(data.response.items[i]))
            if(i == data.response.items.length-1){
              VK.api("friends.get", {"user_id": user2, "fields": "city,photo_200", "v":"5.73"}, function (data_new) {
                for (var j = 0; j < data_new.response.items.length; j++) {
                  all_friends.push(JSON.stringify(data_new.response.items[j]))
                  if(j == data_new.response.items.length-1){
                    all_friends = all_friends.filter(function (elem, pos, arr) {
                        return pos !== arr.indexOf(elem) || pos !== arr.lastIndexOf(elem);
                    });
                    var unique1 = [...new Set(all_friends)];
                    for (var o = 0; o < unique1.length; o++) {
                      unique1[o] = JSON.parse(unique1[o]);
                      if(o == unique1.length-1){
                        unique1 = unique1.map((item, index) =>{
                          return <List key={index}><ListItem
                            before={item.photo_200 ? <Avatar src={item.photo_200}/> : null}
                            description={item.city && item.city.title ? item.city.title : ''}
                          >
                            {`${item.first_name} ${item.last_name}`}
                          </ListItem></List>
                        });
                        this1.setState({
                          popout: null,
                          common_friends: unique1
                        })
                      }
                    }
                  }
                }
              })
            }
          }
        })
      })
    }else{
      this.setState({ popout:
      <Alert
        actions={[{
          title: 'Окей',
          autoclose: true,
          style: 'destructive'
        }]}
        onClose={ () => this.setState({ popout: null }) }
      >
        <h2>Ошибка</h2>
        <p>Данные не корректны</p>
      </Alert>
    });
    }
  }
  auth(){
    var this1 = this;
    VK.Auth.login(function(response) {
    if (response.session) {
      console.log(response.session);
      this1.setState({
        now_page: <FormLayout>
            <FormLayoutGroup top="Ссылки" bottom="Сюда необходимо ввести ссылки на страницы друзей в формате 'https://vk.com/aplinxy9plin', общих друзей которых необходимо получить">
              <Input onChange={evt => this1.setState({user1: evt.target.value})} type="text"/>
              <Input onChange={evt => this1.setState({user2: evt.target.value})} type="text"/>
            </FormLayoutGroup>
            <Button onClick={this.test} size="xl">Получить список</Button>
          </FormLayout>
      })
      if (response.settings) {
        /* Выбранные настройки доступа пользователя, если они были запрошены */
      }
    } else {
      console.log(response);
      /* Пользователь нажал кнопку Отмена в окне авторизации */
    }
  });
  }
  render() {
    return (
      <View popout={this.state.popout} activePanel="main">
      <Panel id="main">
        <PanelHeader>Поиск общих друзей</PanelHeader>
        {this.state.now_page}
        {this.state.common_friends}
        {this.state.go}
      </Panel>
    </View>
    );
  }
}

export default App;
