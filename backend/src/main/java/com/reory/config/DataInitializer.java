package com.reory.config;

import com.reory.repository.DeckRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final DeckRepository deckRepository;

    @Override
    public void run(String... args) {
        // Decks start empty as requested so user creates their own custom decks.
    }
}
