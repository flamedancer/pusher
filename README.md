pusher
======

a game for push boxes  to attactk


1. set nginx conf 
    server {
        listen xxxx;
        location / {
            proxy_pass http://127.0.0.1:5000;
        }
        location ~* ^.+\.(css|js|gif|jpg|jpeg|png|bmp|swf|ioc|rar|zip|txt|flv|mid|doc|ppt|pdf|xls|mp3|wma)$ {
            root pathtocwd/pusher/frame/static;
            expires 15d;
        }
    }
