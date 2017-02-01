import React from 'react';

import ReactDOM from 'react-dom';

import TextField from 'material-ui/TextField';

import RaisedButton from 'material-ui/RaisedButton';

import FontIcon from 'material-ui/FontIcon';

import IconButton from 'material-ui/IconButton';

import getMuiTheme from 'material-ui/styles/getMuiTheme';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import injectTapEventPlugin from 'react-tap-event-plugin';

import $ from 'jquery';

injectTapEventPlugin();

var socket = io();

/*是否屏蔽其他观众*/
var shield = false;

/*是否滚屏*/
var scroll = true;

const Chat = React.createClass({
    getInitialState: function() {
        return {
            content: '',
        };
    },
    setcontent : function(event){
        if (event.target.value == '\n' ) return false;
        this.setState({
            content: event.target.value
        });
    },
    submit : function(argument) {
        var self = this;
        if(this.state.content ) {
            socket.emit('chat message', this.state.content);
            $('#messages').append("<li><span class='self'>Yourself：</span> <span class='message'>"+this.state.content+"</span></li>");
            this.setState({
                content: ''
            });
            /*一个奇怪的bug，用延迟可以解*/
            setTimeout(function(){
                //console.log(self.state.content)
                //console.log(self.state.content.length)
                self.setState({
                    content: ''
                });
            },10)
            return false;
       }
        
        return false;
    },
    /*清空聊天室*/
    clearChat : function(){
        $('#messages').empty();
    },
    /*设置屏蔽*/
    setShield : function(){
        shield = !shield;
        if(shield)
            $('#messages').append("<li class='alerts'><span>系统提醒：已屏蔽其他用户</span></li>");
        else
            $('#messages').append("<li class='alerts'><span>系统提醒：已解开屏蔽</span></li>");
    },
    /*设置滚屏*/
    setScroll : function(){
        scroll = !scroll;
    },
    /*摁下回车*/
    keyDown : function(event){
        var keynum;
        keynum = window.event ? event.keyCode : event.which;
        if (keynum == 13 && !event.shiftKey) {
            this.submit();
        }
    },
    render : function(){
        const iconButtonStyle = {
            height : 24,
            width : 24,
            marginRight : 10,
            padding : 0,
        }
        const tooltipStyles = {
            marginLeft : -11
        }
        return(
            
            <div className="chat-dispatch">
                <div className="chat-tools">
                    <link href="/css/material-icons.css" rel="stylesheet" />
                    <IconButton 
                        tooltip="清屏"
                        style={iconButtonStyle}
                        onClick = {this.clearChat}
                        tooltipPosition ='top-center'
                        tooltipStyles = {tooltipStyles}
                    >
                        <i className="material-icons" style={{margin:'-10px'}}>delete</i>
                    </IconButton>
                    <IconButton 
                        tooltip="屏蔽其他观众"
                        style={iconButtonStyle}
                        onClick={this.setShield}
                        tooltipPosition ='top-center'
                        tooltipStyles = {tooltipStyles}
                    >
                        <i className="material-icons" style={{margin:'-10px'}}>block</i>
                    </IconButton>
                    <IconButton 
                        tooltip="滚屏"
                        style={iconButtonStyle}
                        onClick={this.setScroll}
                        tooltipPosition ='top-center'
                        tooltipStyles = {tooltipStyles}
                    >
                        <i className="material-icons" style={{margin:'-10px'}}>arrow_drop_down_circle</i>
                    </IconButton>
                </div>
                    
                <div
                    className="chat-send"
                >
                    <TextField
                        hintText="快和大家打个招呼吧"
                        multiLine={true}
                        rows={2}
                        rowsMax={2}
                        underlineShow={false}
                        onChange={this.setcontent}
                        onKeyDown={this.keyDown}
                        value={this.state.content}
                        style={{

                        }}
                        inputStyle={{

                        }}
                        hintStyle={{
                            marginLeft: '10px',
                            marginBottom: '16px'
                        }}
                        textareaStyle={{
                            border: '1px solid #d8d8d8',
                            borderBottomLeftRadius: 3,
                            borderTopLeftRadius: 3,
                            borderRightWidth: 0,
                            padding:'8px 9px'
                        }}
                    />
                    <RaisedButton 
                        label="发送" 
                        primary={true} 
                        style={{
                            height:46,
                            marginTop: 12,
                        }}
                        labelStyle={{
                            marginTop: 12
                        }}
                        onClick = {this.submit}
                    />
                </div>
            </div>
        )
    }
})

ReactDOM.render(
    <MuiThemeProvider  muiTheme={getMuiTheme()}>
        <Chat />
    </MuiThemeProvider>, 
    document.getElementById('chat')
);


socket.on('chat message', function(msg){
    if (!shield) {
        if(socket.id.substr(0,4)!=msg.substr(0,4)){
            $('#messages').append("<li><span class='user-name'>游客"+msg.substr(0,4).toUpperCase()+"：</span> <span class='message'>"+msg.substr(5)+"</span></li>");
        }
        if(scroll) document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight
    }
    
});