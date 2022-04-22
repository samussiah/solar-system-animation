#' <Add Title>
#'
#' <Add Description>
#'
#' @import htmlwidgets
#'
#' @export
solarSystemAnimation <- function(
    data,
    settings = NULL,
    width = NULL,
    height = NULL,
    elementId = NULL
) {
    inputs <- list(
        data = data,
        settings = jsonlite::toJSON(
            settings,
            auto_unbox = TRUE,
            null = 'null'
        )
    )

    htmlwidgets::createWidget(
        name = 'solarSystemAnimation',
        inputs,
        width = width,
        height = height,
        package = 'solarSystemAnimation',
        elementId = elementId
    )
}

#' Shiny bindings for solarSystemAnimation
#'
#' Output and render functions for using solarSystemAnimation within Shiny
#' applications and interactive Rmd documents.
#'
#' @param outputId output variable to read from
#' @param width,height Must be a valid CSS unit (like \code{'100\%'},
#'     \code{'400px'}, \code{'auto'}) or a number, which will be coerced to a
#'     string and have \code{'px'} appended.
#' @param expr An expression that generates a solarSystemAnimation
#' @param env The environment in which to evaluate \code{expr}.
#' @param quoted Is \code{expr} a quoted expression (with \code{quote()})? This
#'     is useful if you want to save an expression in a variable.
#'
#' @name solarSystemAnimation-shiny
#'
#' @export
solarSystemAnimationOutput <- function(outputId, width = '100%', height = '400px'){
    htmlwidgets::shinyWidgetOutput(outputId, 'solarSystemAnimation', width, height, package = 'solarSystemAnimation')
}

#' @rdname solarSystemAnimation-shiny
#' @export
renderSolarSystemAnimation <- function(expr, env = parent.frame(), quoted = FALSE) {
    if (!quoted) { expr <- substitute(expr) } # force quoted
    htmlwidgets::shinyRenderWidget(expr, solarSystemAnimationOutput, env, quoted = TRUE)
}
