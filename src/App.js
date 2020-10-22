import React, { useEffect, useState } from 'react'
import { fetchMessage, getProfile } from './api'
import styled from 'styled-components'
import Logo from './logo.svg'
import Typewriter from 'typewriter-effect'
import loading from './loading.json'
import Lottie from 'react-lottie'

const Messages = styled.div`
    width: 100%;
    font-weight: 400;
    font-size: 24px;
    font-family: Roboto;
`

const Responses = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-items: center;
    text-align: center;
`
const Buttons = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
`
const Button = styled.button`
    margin: 0 10px;
    padding: 10px 20px;
    background: #ee2e5d;
    border-radius: 10px;
    color: white;
    font-size: 20px;
    font-weight: 600;
    border: 1px solid white;
    font-family: Roboto;
`
const Input = styled.textarea`
    width: 100%;
    height: 80%;
    padding: 10px;
    border: none;
    font-weight: 400;
    margin: 20px 0;
    box-sizing: border-box;
    font-size: 16px;
    font-family: Roboto;
`
const Profile = styled.div`
    width: 100%;
    height: 80%;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    color: #ee2e5d;
    font-weight: 500;
    margin: 20px 0;
    font-size: 32px;
    font-family: Roboto;
`
const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 400px;
    border-radius: 10px;
    border: 3px solid #ee2e5d;
    min-height: 300px;
    padding: 20px;
`
const LogoImage = styled.img`
    width: 100px;
    margin-bottom: 50px;
`

function convertToDecimal(newText) {
    const clearedNewText = newText.replace(/\D/g, '')
    let updatedNewText = ''

    if (clearedNewText.length === 0) {
        updatedNewText = ''
    } else if (clearedNewText.length >= 1 && clearedNewText.length <= 6) {
        let indexSlice = 1

        if (clearedNewText.length >= 5 && !clearedNewText.startsWith('0')) {
            indexSlice = 2
        } else if (
            (clearedNewText.startsWith('0') && clearedNewText.length >= 3) ||
            clearedNewText.length >= 3
        ) {
            indexSlice = 2
        }

        clearedNewText.length === 1
            ? (updatedNewText = clearedNewText)
            : (updatedNewText = [
                  clearedNewText.slice(0, clearedNewText.length - indexSlice),
                  ',',
                  clearedNewText.slice(clearedNewText.length - indexSlice),
              ].join(''))
    }
    return updatedNewText
}

function App() {
    const [messages, setMessages] = useState([])
    const [idMessage, setIdMessage] = useState()
    const [renderInput, setRenderInput] = useState(false)
    const [buttons, setButtons] = useState([])
    const [inputs, setInputs] = useState([])
    const [answers, setAnswers] = useState({})
    const [profile, setProfile] = useState()

    const nextStep = () => {
        setMessages(null)
        setRenderInput(false)
        fetchMessage(idMessage, answers).then((response) => {
            setIdMessage(response.id)
            setMessages(response.messages)
            setButtons(response.buttons)
            setInputs(response.inputs)
            if (response.id === 'final') {
                getProfile(answers).then((response) => {
                    setProfile(
                        response.user.investmentProfile.riskToleranceProfile,
                    )
                })
            }
        })
    }

    useEffect(() => {
        nextStep()
    }, [])

    return (
        <>
            <LogoImage src={Logo} alt={'Logo Warren'} />
            <Container>
                {messages && messages.length > 0 ? (
                    <>
                        <Messages>
                            {messages && messages.length > 0 && (
                                <Typewriter
                                    onInit={(typewriter) => {
                                        typewriter
                                            .changeDelay(20)
                                            .typeString(
                                                messages[0].value.replaceAll(
                                                    /\^[0-9]+/gi,
                                                    '',
                                                ),
                                            )
                                            .typeString(
                                                messages[1] &&
                                                    messages[1].value.replaceAll(
                                                        /\^[0-9]+/gi,
                                                        '',
                                                    ),
                                            )
                                            .typeString(
                                                messages[2] &&
                                                    messages[2].value.replaceAll(
                                                        /\^[0-9]+/gi,
                                                        '',
                                                    ),
                                            )
                                            .typeString(
                                                messages[3] &&
                                                    messages[3].value.replaceAll(
                                                        /\^[0-9]+/gi,
                                                        '',
                                                    ),
                                            )
                                            .callFunction(() => {
                                                setRenderInput(true)
                                            })
                                            .start()
                                    }}
                                />
                            )}
                        </Messages>
                        <Responses>
                            {renderInput &&
                                inputs.map((input) => (
                                    <Input
                                        placeholder="Digite aqui..."
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                nextStep()
                                            }
                                        }}
                                        key={input.mask}
                                        value={
                                            answers ? answers[idMessage] : ''
                                        }
                                        onChange={(e) => {
                                            let value = answers[idMessage] || ''
                                            if (
                                                !Number.isNaN(
                                                    parseFloat(e.target.value),
                                                ) &&
                                                input.mask === 'currency'
                                            ) {
                                                value = convertToDecimal(
                                                    e.target.value,
                                                )
                                            }
                                            if (
                                                !Number.isNaN(
                                                    parseFloat(e.target.value),
                                                ) &&
                                                e.target.value.length <= 2 &&
                                                input.mask === 'integer'
                                            ) {
                                                value = parseInt(e.target.value)
                                            }
                                            if (input.type === 'string') {
                                                value = e.target.value
                                            }
                                            if (e.target.value.length === 0) {
                                                value = ''
                                            }
                                            console.log(value)
                                            setAnswers({
                                                ...answers,
                                                [idMessage]: value,
                                            })
                                        }}
                                    />
                                ))}
                            {idMessage === 'final' ? (
                                profile ? (
                                    <Profile>{profile}</Profile>
                                ) : (
                                    <Lottie
                                        options={{
                                            loop: true,
                                            autoplay: true,
                                            animationData: loading,
                                        }}
                                        height={50}
                                        width={50}
                                    />
                                )
                            ) : null}
                        </Responses>
                        <Buttons>
                            {renderInput && buttons.length > 0
                                ? buttons.map((button) => (
                                      <Button
                                          onClick={() => {
                                              setAnswers({
                                                  ...answers,
                                                  [idMessage]: button.value,
                                              })
                                              nextStep()
                                          }}
                                      >
                                          {button.label.title}
                                      </Button>
                                  ))
                                : renderInput &&
                                  !profile && (
                                      <Button onClick={() => nextStep()}>
                                          OK
                                      </Button>
                                  )}
                        </Buttons>
                    </>
                ) : (
                    <Lottie
                        options={{
                            loop: true,
                            autoplay: true,
                            animationData: loading,
                        }}
                        height={80}
                        width={80}
                    />
                )}
            </Container>
        </>
    )
}

export default App
