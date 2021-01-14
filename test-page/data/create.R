library(tidyverse)

set.seed(8675309)
n <- 100

state0 <- tibble(
    id = 1:n,
    event_order = 0,
    event = 'Pre-onset',
    event_position = 0,
    stdy = 0,
    endy = 1,
    color = 'Pre-onset',
    shape = 'Not Treated'
)

state1 <- state0 %>%
    mutate(
        event_order = 1,
        event = sample(c('Mild', 'Moderate', 'Severe'), n, T),
        event_position = case_when(
            event == 'Mild' ~ -45,
            event == 'Moderate' ~ 0,
            event == 'Severe' ~ 45,
            TRUE ~ NaN
        ),
        stdy = endy,
        endy = case_when(
            event == 'Mild' ~ stdy + sample(0:6, n, T),
            event == 'Moderate' ~ stdy + sample(0:13, n, T),
            event == 'Severe' ~ stdy + sample(0:21, n, T),
            TRUE ~ stdy
        ),
        color = event
    )

state2 <- state1 %>%
    mutate(
        event_order = 2,
        event = sample(c('Not Treated', 'Standard of Care', 'Rescue Meds'), n, T),
        event_position = case_when(
            event == 'Not Treated' ~ -15,
            event == 'Standard of Care' ~ 0,
            event == 'Rescue Meds' ~ 15,
            TRUE ~ NaN
        ),
        stdy = endy,
        endy = stdy + sample(0:27, n, T),
        shape = event
    )

state3 <- state2 %>%
    mutate(
        event_order = 3,
        event = sample(c('Resolved', 'Resolved w/ Sequelae', 'Not Resolved'), n, T),
        event_position = case_when(
            event == 'Resolved' ~ -20,
            event == 'Resolved w/ Sequelae' ~ 0,
            event == 'Not Resolved' ~ 20,
            TRUE ~ NaN
        ),
        stdy = endy,
        endy = stdy + sample(0:13, n, T)
    )

state4 <- state3 %>%
    mutate(
        event_order = 4,
        event = sample(c('Major Gain', 'Minor Gain', 'Minor Loss', 'Major Loss'), n, T),
        event_position = case_when(
            event == 'Major Gain' ~ -15,
            event == 'Minor Gain' ~ -5,
            event == 'Minor Loss' ~ 5,
            event == 'Major Loss' ~ 15,
            TRUE ~ NaN
        ),
        stdy = endy,
        endy = stdy
    )

states <- state0 %>%
    bind_rows(state1) %>%
    bind_rows(state2) %>% #filter(event != 'Not Treated')) %>%
    bind_rows(state3) %>%
    bind_rows(state4) %>%
    arrange(id, event_order) %>%
    mutate(
        duration = endy - stdy + 1
    )

write.csv(
    states,
    './adverse-event-outcome.csv',
    na = '',
    row.names = FALSE
)