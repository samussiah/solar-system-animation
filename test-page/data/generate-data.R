generateData <- function(
    n = 1000,
    max_duration = 1000,
    strata = NULL,
    states = list(
        list(
            value = 'Home',
            probability = .75,
            duration = 0,
            recurrence = TRUE,
            final = FALSE
        ),
        list(
            value = 'Hospitalization',
            probability = .15,
            duration = 28,
            recurrence = TRUE,
            final = FALSE
        ),
        list(
            value = 'ICU',
            probability = .06,
            duration = 14,
            recurrence = TRUE,
            final = FALSE
        ),
        list(
            value = 'Death (CV-related)',
            probability = .03,
            duration = 1,
            recurrence = FALSE,
            final = TRUE
        ),
        list(
            value = 'Death (other)',
            probability = .01,
            duration = 1,
            recurrence = FALSE,
            final = TRUE
        )
    )
) {
    require(dplyr)

    states <- bind_rows(states) %>%
        mutate(
            probability_upper = cumsum(probability),
            probability_lower = ifelse(row_number() > 1, lag(probability_upper), 0),
            duration_lower = 1
        )

    ids <- list()

    for (i in 1:n) {
        id <- list()
        total_duration <- 0
        j <- 0
        state_previous <- list(value = '_initial_')
        state_sequence <- 0

        if (!is.null(strata))
            strata_sampled <- lapply(
                strata,
                function(stratum) {
                    stratum$value <- sample(stratum$values, 1)
                    return(stratum)
                }
            )

        while (total_duration < max_duration) {
            j = j + 1

            # Randomly sample a state.
            random_number <- runif(1)
            state <- states %>%
                filter(
                    probability_lower <= random_number &
                    random_number < probability_upper
                )
            
            if (!is.null(strata))
                for (stratum in strata_sampled)
                    state[stratum$key] <- stratum$value

            # Track state change to later collapse identical states.
            if (state$value != state_previous$value)
                state_sequence = state_sequence + 1
            state$sequence <- state_sequence
            state_previous <- state
            state$id <- i

            # Randomly sample a duration.
            state$duration_upper <- ifelse(
                state$duration == 0,
                max_duration - total_duration,
                state$duration
            )
            state$duration <- sample(state$duration_lower:state$duration_upper, 1)
            state$timepoint1 <- total_duration + 1
            total_duration = total_duration + state$duration
            state$timepoint2 <- total_duration

            id[[j]] <- state

            if (state$final) break
        }

        ids[[i]] <- id
    }
    
    group_by_vars <- c('id', sapply(strata, function(stratum) stratum$key), 'sequence', 'state')

    data <- bind_rows(ids) %>%
        rename(
            state = value
        ) %>%
        group_by_at(group_by_vars) %>%
        summarize(
            timepoint1 = min(timepoint1),
            timepoint2 = max(timepoint2),
            duration = sum(duration)
        ) %>%
        ungroup

    return(data)
}

data <- generateData(
    10000,
    821,
    strata = list(
        list(
            key = 'arm',
            values = c('Treatment A', 'Treatment B', 'Placebo')
        ),
        list(
            key = 'sex',
            values = c('F', 'M')
        )
    )
)

data.table::fwrite(
    data %>%
        rename(
            event = state,
            stdy = timepoint1,
            endy = timepoint2
        ) %>%
        mutate(
            event_order = case_when(
                event == 'Home' ~ 0,
                event == 'Hospitalization' ~ 1,
                event == 'ICU' ~ 2,
                TRUE ~ 3
            ),
            event_position = case_when(
                event == 'Home' ~ 0,
                event == 'Hospitalization' ~ -45,
                event == 'ICU' ~ 25,
                event == 'Death (CV-related)' ~ -10,
                TRUE ~ 10
            )
        ),
    './1e5.csv'
)
