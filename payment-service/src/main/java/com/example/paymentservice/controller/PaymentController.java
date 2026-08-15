package com.example.paymentservice.controller;

import com.example.paymentservice.model.Payment;
import com.example.paymentservice.repository.PaymentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/payments")
@Tag(name = "Payment & Billing Management", description = "Endpoints for Student 5 / Extra: Ticketing Payment processing, Transaction records, and PDF Invoice Receipts")
public class PaymentController {

    @Autowired
    private PaymentRepository paymentRepository;

    @PostMapping("/process")
    @Operation(summary = "Process a new cinema ticket payment", description = "Generates formatted invoice details and saves payment record")
    public ResponseEntity<Payment> processPayment(@RequestBody Payment payment) {
        payment.setStatus("SUCCESS");

        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        
        String formattedBill = String.format(
            "===================================================\n" +
            "         CINEMA TICKETING OFFICIAL INVOICE          \n" +
            "===================================================\n" +
            "Date & Time    : %s\n" +
            "Customer Email : %s\n" +
            "Movie Title    : %s\n" +
            "Payment Method : %s\n" +
            "Amount Paid    : Rs. %.2f\n" +
            "Payment Status : SUCCESS\n" +
            "===================================================\n" +
            " Thank you for choosing our Cinema Booking System!  \n" +
            "===================================================\n",
            timestamp,
            payment.getUserEmail() != null ? payment.getUserEmail() : "guest@cinema.lk",
            payment.getMovieTitle() != null ? payment.getMovieTitle() : "Cinema Ticket",
            payment.getPaymentMethod() != null ? payment.getPaymentMethod() : "Credit / Debit Card",
            payment.getAmount()
        );

        payment.setBillingDetails(formattedBill);
        Payment savedPayment = paymentRepository.save(payment);

        String updatedBill = String.format(
            "===================================================\n" +
            "         CINEMA TICKETING OFFICIAL INVOICE          \n" +
            "===================================================\n" +
            "Transaction ID : %s\n" +
            "Date & Time    : %s\n" +
            "Customer Email : %s\n" +
            "Movie Title    : %s\n" +
            "Payment Method : %s\n" +
            "Amount Paid    : Rs. %.2f\n" +
            "Payment Status : SUCCESS\n" +
            "===================================================\n" +
            " Thank you for choosing our Cinema Booking System!  \n" +
            "===================================================\n",
            savedPayment.getId(),
            timestamp,
            savedPayment.getUserEmail(),
            savedPayment.getMovieTitle(),
            savedPayment.getPaymentMethod(),
            savedPayment.getAmount()
        );

        savedPayment.setBillingDetails(updatedBill);
        savedPayment = paymentRepository.save(savedPayment);

        return new ResponseEntity<>(savedPayment, HttpStatus.CREATED);
    }

    @GetMapping
    @Operation(summary = "Get all payment transaction records", description = "Returns full list of all processed payments")
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentRepository.findAll());
    }

    @GetMapping("/user/{email}")
    @Operation(summary = "Get user payments by email", description = "Retrieves payment history for a specific customer email")
    public ResponseEntity<List<Payment>> getPaymentsByUserEmail(@PathVariable String email) {
        return ResponseEntity.ok(paymentRepository.findByUserEmail(email));
    }

    // Downloadable PDF Invoice Receipt Endpoint
    @GetMapping("/bill/{id}")
    @Operation(summary = "Download PDF Billing Receipt", description = "Generates and streams a downloadable PDF receipt for a payment ID")
    public ResponseEntity<byte[]> downloadBillPdf(@PathVariable String id) {
        Optional<Payment> paymentOpt = paymentRepository.findById(id);

        if (paymentOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        Payment payment = paymentOpt.get();
        String billText = payment.getBillingDetails();

        if (billText == null || billText.isEmpty()) {
            billText = "Cinema Billing Receipt - Transaction ID: " + payment.getId() + "\nAmount: Rs. " + payment.getAmount();
        }

        // Generate clean PDF byte structure
        String pdfHeader = "%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n" +
                "2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n" +
                "3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj\n" +
                "4 0 obj\n<< /Length " + (billText.length() + 100) + " >>\nstream\nBT\n/F1 12 Tf\n50 730 Td\n14 TL\n";
        
        StringBuilder pdfStream = new StringBuilder();
        for (String line : billText.split("\n")) {
            String sanitizedLine = line.replace("(", "\\(").replace(")", "\\)");
            pdfStream.append("(").append(sanitizedLine).append(") '\n");
        }
        
        String pdfFooter = "ET\nendstream\nendobj\n" +
                "5 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>\nendobj\n" +
                "xref\n0 6\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000244 00000 n \n0000000450 00000 n \n" +
                "trailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n530\n%%EOF";

        byte[] pdfBytes = (pdfHeader + pdfStream.toString() + pdfFooter).getBytes(StandardCharsets.UTF_8);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("attachment", "invoice-" + payment.getId() + ".pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete payment transaction by ID", description = "Deletes a payment record from the database")
    public ResponseEntity<?> deletePayment(@PathVariable String id) {
        if (paymentRepository.existsById(id)) {
            paymentRepository.deleteById(id);
            return ResponseEntity.ok(java.util.Map.of("message", "Payment transaction deleted successfully", "id", id));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(java.util.Map.of("error", "Payment not found with ID: " + id));
    }
}
