package com.skillverse.repository;

import com.skillverse.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification,String> {
  List<Notification> findByRecipientUsernameOrderByCreatedAtDesc(String recipientUsername);
}
