CREATE TABLE `user_transaction` (
   `id` BIGINT NOT NULL AUTO_INCREMENT , 
   `userid` BIGINT NOT NULL , 
   `amount` BIGINT NOT NULL , 
   `timestamp` TIMESTAMP on update CURRENT_TIMESTAMP NOT NULL , 
   PRIMARY KEY (`id`)) 
   ENGINE = InnoDB CHARSET=utf8 COLLATE utf8_general_ci;