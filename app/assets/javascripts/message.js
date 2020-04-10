$(function(){
  function buildHTML(message){
    if (message.image) {
      var html = 
      `<div class = "chat" data-message-id=${message.id}>
        <div class = "upper-chat">
          <div class = "upper-chat__user-name">
            ${message.user_name}
          </div>
          <div class = "upper-chat__date">
            ${message.created_at}
          </div>
        </div>
        <div class = "lower-chat">
          <p class = "lower-chat__content">
            ${message.content}
          </p>
        </div>
        <img src=${message.image}>
      </div>`
    return html;
    } else {
      var html = 
      `<div class = "chat" data-message-id=${message.id}>
        <div class = "upper-chat">
          <div class = "upper-chat__user-name">
            ${message.user_name}
        </div>
          <div class = "upper-chat__date">
            ${message.created_at}
        </div>
      </div>
        <div class = "lower-chat">
          <p class = "lower-chat__content">
            ${message.content}
          </p>
        </div>
      </div>`
      return html;
    };  
  }

  $('#new_message').on('submit', function(e){
    e.preventDefault()
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,  
      type: 'POST',  
      data: formData,  
      dataType: 'json',
      processData: false,
      contentType: false

    })
    .done(function(data){
      var html = buildHTML(data);
      $('.chat-btm').append(html);
      $('.chat-btm').animate({ scrollTop: $('.chat-btm')[0].scrollHeight});
      $('form')[0].reset();
      $('.send-box').attr('disabled', false);
    })
    .fail(function(){
      alert('error');
    })
  });

  $(function(){
    var reloadMessages = function(){  
      if (window.location.href.match(/\/groups\/\d+\/messages/)){ 
        var last_message_id = $('.chat:last').data("message-id"); 
        console.log(last_message_id);
        $.ajax({
          url: "api/messages", 
          type: 'get', 
          dataType: 'json', 
          data: {id: last_message_id} 
        })
        .done(function(messages){ 
          if (messages.length !== 0) {
            var insertHTML = ''; 
            $.each(messages, function(i, message) {
              insertHTML += buildHTML(message)
            });
            $('.chat-btm').append(insertHTML); 
            $('.chat-btm').animate({scrollTop: $('.chat-btm')[0].scrollHeight}, 50); 
            }
        })
        .fail(function(){ 
          alert('自動更新に失敗しました'); 
        });
      }
    };
    if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000); 
    }    
  });
});

