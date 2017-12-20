CREATE TABLE `user_integration_auth` (
   `id` BIGINT NOT NULL AUTO_INCREMENT , 
   `userid` BIGINT NOT NULL , 
   `type` varchar(65535) NOT NULL , 
   `data` varchar(65535) NOT NULL , 
   `token` varchar(65535) NOT NULL , 
   `timestamp` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL , 
   PRIMARY KEY (`id`)) 
   ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;