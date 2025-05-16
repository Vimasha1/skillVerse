// src/main/java/com/skillverse/controller/NotificationController.java
package com.skillverse.controller;

import com.skillverse.model.Notification;
import com.skillverse.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin("http://localhost:3000")
public class NotificationController {
  @Autowired
  private NotificationService svc;

  // support both /api/notifications/{username} *and* /api/notifications/recipient/{username}
  @GetMapping({"/{username}", "/recipient/{username}"})
  public List<Notification> getNotifications(@PathVariable String username) {
    return svc.getFor(username);
  }

  // support both /api/notifications/{username}/mark-read and /api/notifications/recipient/{username}/mark-read
  @PostMapping({"/{username}/mark-read", "/recipient/{username}/mark-read"})
  public ResponseEntity<Void> markRead(@PathVariable String username) {
    svc.markAllRead(username);
    return ResponseEntity.ok().build();
  }
}
