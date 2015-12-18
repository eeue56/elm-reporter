module Main where

import Graphics.Element exposing (show)
import Reporter exposing (..)
import Html exposing (..)
import Html.Attributes exposing (..)
import Html.Events exposing (..)
import Time exposing (every, second)

add : Int -> Int -> Int
add x y = x + y

type Action = UpdateTime Float | Clicked | Noop

type alias Model =
    { time : Float
    , clicked : Int
    }

initModel = { time = 0, clicked = 0 }

update : Action -> Model -> Model
update action model =
    case action of
        UpdateTime time -> { model | time = time }
        Clicked -> { model | clicked = model.clicked + 1 }
        Noop -> model

clickbox = Signal.mailbox Noop

model' =
    Signal.foldp
        update
        (stealNotify initModel)
        clickbox.signal

view address model =
    div
        [ onClick address Clicked ]
        [ text <| toString model.clicked ]


main = Signal.map (view clickbox.address) model'
