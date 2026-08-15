package com.example.notificationservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;

@Document(collection = "notifications")
public class Notification {
    
    @Id
    private String id;
    private String userEmail;
    private String subject;
    private String message;
    private String type; // EMAIL, SMS, SYSTEM
    private Date timestamp = new Date();
    private boolean readStatus = false;

    public Notification() {}

    public Notification(String userEmail, String subject, String message, String type) {
        this.userEmail = userEmail;
        this.subject = subject;
        this.message = message;
        this.type = type != null ? type : "EMAIL";
        this.timestamp = new Date();
        this.readStatus = false;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Date getTimestamp() { return timestamp; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }

    public boolean isReadStatus() { return readStatus; }
    public void setReadStatus(boolean readStatus) { this.readStatus = readStatus; }
}
