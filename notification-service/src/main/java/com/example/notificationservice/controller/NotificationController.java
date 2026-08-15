package com.example.notificationservice.controller;

import com.example.notificationservice.model.Notification;
import com.example.notificationservice.repository.NotificationRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/notifications")
@Tag(name = "Notification Management", description = "Endpoints for Student 4: Email and SMS Notification dispatch and logs")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    @Operation(summary = "Get all system notifications")
    public List<Notification> getAllNotifications() {
        return notificationRepository.findAll();
    }

    @GetMapping("/user/{userEmail}")
    @Operation(summary = "Get notification history by user email")
    public ResponseEntity<List<Notification>> getNotificationsByUserEmail(@PathVariable String userEmail) {
        return ResponseEntity.ok(notificationRepository.findByUserEmailOrderByTimestampDesc(userEmail));
    }

    @PostMapping("/send")
    @Operation(summary = "Dispatch a new Email or SMS notification")
    public ResponseEntity<?> sendNotification(@RequestBody Notification notification) {
        if (notification.getUserEmail() == null || notification.getUserEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Target user email is required"));
        }
        if (notification.getSubject() == null || notification.getSubject().isBlank()) {
            notification.setSubject("System Notification");
        }
        if (notification.getType() == null) {
            notification.setType("EMAIL");
        }
        notification.setTimestamp(new Date());
        notification.setReadStatus(false);

        Notification savedNotification = notificationRepository.save(notification);
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                "status", "SENT",
                "message", "Notification dispatched successfully",
                "notification", savedNotification
        ));
    }

    @PutMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<?> markAsRead(@PathVariable String id) {
        Optional<Notification> notifOpt = notificationRepository.findById(id);
        if (notifOpt.isPresent()) {
            Notification notification = notifOpt.get();
            notification.setReadStatus(true);
            Notification updatedNotification = notificationRepository.save(notification);
            return ResponseEntity.ok(updatedNotification);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Notification not found with ID: " + id));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a notification log")
    public ResponseEntity<?> deleteNotification(@PathVariable String id) {
        if (notificationRepository.existsById(id)) {
            notificationRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Notification deleted successfully", "id", id));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Notification not found with ID: " + id));
    }
}
