package com.skillverse.service;

import com.skillverse.model.Notification;
import com.skillverse.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {
  @Autowired private NotificationRepository repo;

  public Notification create(String recipient, String actor, String type,
                             String postId, String commentId, String replyId) {
    if (recipient.equals(actor)) return null; // no self-notifications
    Notification n = new Notification();
    n.setRecipientUsername(recipient);
    n.setActorUsername(actor);
    n.setType(type);
    n.setPostId(postId);
    n.setCommentId(commentId);
    n.setReplyId(replyId);
    return repo.save(n);
  }

  public List<Notification> getFor(String username) {
    return repo.findByRecipientUsernameOrderByCreatedAtDesc(username);
  }

  public void markAllRead(String username) {
    var list = repo.findByRecipientUsernameOrderByCreatedAtDesc(username);
    list.forEach(n->n.setRead(true));
    repo.saveAll(list);
  }
}
