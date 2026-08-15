package com.example.movieservice.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "offers")
public class Offer {
    
    @Id
    private String id;
    private String title;
    private String description;
    private String code;
    private double discountValue;
    private String type; // DISCOUNT, PROMOTION, SPECIAL_PACKAGE
    private String imageUrl;
    private String validUntil;

    public Offer() {}

    public Offer(String title, String description, String code, double discountValue, String type, String imageUrl, String validUntil) {
        this.title = title;
        this.description = description;
        this.code = code;
        this.discountValue = discountValue;
        this.type = type;
        this.imageUrl = imageUrl;
        this.validUntil = validUntil;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public double getDiscountValue() { return discountValue; }
    public void setDiscountValue(double discountValue) { this.discountValue = discountValue; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getValidUntil() { return validUntil; }
    public void setValidUntil(String validUntil) { this.validUntil = validUntil; }
}
