import { Ionicons } from '@expo/vector-icons'
import { useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, FlatList, ScrollView, Text, View } from 'react-native'
import { Checkbox, IconButton, List } from 'react-native-paper'
import axios from '../../../../../api/axios'
import { router } from 'expo-router'
import { LoadingScreen } from '../../../../../components/Dialog'
import { useAuthContext } from '../../../../../contexts/AuthContext'

const { width } = Dimensions.get('window')

const Request = () => {
  const slideIndex = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [credentials, setCredentials] = useState([])
  const [credentialChecked, setCredentialChecked] = useState({})
  const [purposes, setPurposes] = useState([])
  const [purposeChecked, setPurposeChecked] = useState({})
  const [credentialCount, setCredentialCount] = useState({})
  const [loading, setLoading] = useState(false)
  const [links, setLinks] = useState([])
  const [studentLinks, setStudentLinks] = useState([])
  const { user } = useAuthContext()

  useEffect(() => {
    const loadCredentialPurpose = async () => {
      setLoading(true)
      await getCredential()
      await getPurpose()
      await getLink()
      await getStudentLink()
      setLoading(false)
    }
    loadCredentialPurpose()
  }, [])

  const getCredential = async () => {
    await axios.get('/credential/get-credential')
      .then(({ data }) => {
        setCredentials(data)
      })
  }

  const getPurpose = async () => {
    await axios.get('/credential/get-purpose')
      .then(({ data }) => {
        setPurposes(data)
      })
  }

  const getLink = async () => {
    await axios.get('/credential/get-link')
      .then(({ data }) => {
        setLinks(data)
      })
  }

  const getStudentLink = async () => {
    await axios.get('/credential/get-student-link')
      .then(({ data }) => {
        setStudentLinks(data)
      })
  }

  const handleCredentialCheckbox = (id) => {
    setCredentialChecked((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))

    if (credentialChecked[id]) {
      setPurposeChecked((prev) => {
        const updated = { ...prev }
        delete updated[id]
        return updated
      })
    }
  }

  const handlePurposeCheckbox = (credentialId, purposeId) => {
    setPurposeChecked((prev) => {
      const updated = { ...prev }
      if (updated[credentialId] && updated[credentialId][purposeId]) {
        delete updated[credentialId][purposeId]
        if (Object.keys(updated[credentialId]).length === 0) {
          delete updated[credentialId]
        }
      } else {
        updated[credentialId] = updated[credentialId] || {}
        updated[credentialId][purposeId] = true
      }
      return updated
    })
  }

  const handleQuantityChange = (credentialId, purposeId, delta) => {
    setCredentialCount((prevCounts) => {
      const currentCount = prevCounts[credentialId]?.[purposeId] || 1
      const newCount = Math.max(currentCount + delta, 1)
      return {
        ...prevCounts,
        [credentialId]: {
          ...prevCounts[credentialId],
          [purposeId]: newCount,
        },
      }
    })
  }

  const selectedCredentials = credentials.filter((credential) =>
    Object.keys(purposeChecked[credential.id] || {}).some(
      (purposeId) => purposeChecked[credential.id][purposeId]
    )
  )

  const checkOutData = selectedCredentials.map((credential) => ({
    credentialId: credential.id,
    credentialAmount: credential.amount,
    selectedPurposes: Object.keys(purposeChecked[credential.id] || {}).filter(
      (purposeId) => purposeChecked[credential.id][purposeId]
    ),
    quantities: Object.keys(purposeChecked[credential.id] || {}).reduce((acc, purposeId) => {
      acc[purposeId] = credentialCount[credential.id]?.[purposeId] || 1
      return acc
    }, {}),
  }))

  const handleCheckOut = async () => {
    Alert.alert('Confirmation Alert!', 'Are you sure you want to continue your credential request?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes', onPress: async () => {
          setLoading(true)
          await axios.post('/student/request-credential', { checkOutData })
            .then(() => {
              router.back()
            })
            .finally(() => {
              setLoading(false)
            })
        }
      },
    ])
  }

  const slides = [
    {
      key: 'slide1',
      component: (
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, width: width }}>
          {credentials.map((credential, index) => {
            const isDisabled = studentLinks.some(
              (studentLink) =>
                studentLink.credential_id === credential.id && studentLink.student_id === user.student.id
            )
            return (
              <List.Item
                onPress={() => handleCredentialCheckbox(credential.id)}
                key={index}
                title={() => <Text className="text-sm font-pmedium">{credential.credential_name}</Text>}
                description={() => <Text className="text-sm font-pregular">{isDisabled ? 'This credential is one-time request only.' : `₱ ${parseFloat(credential.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}</Text>}
                left={(props) => <Text {...props} className="text-sm font-pregular">{index + 1}</Text>}
                right={() => (
                  <Checkbox
                    status={credentialChecked[credential.id] ? 'checked' : 'unchecked'}
                  />
                )}
                className={isDisabled && 'bg-red-100'}
                disabled={isDisabled}
              />
            );
          })}
        </ScrollView>
      )
    },
    {
      key: 'slide2',
      component: (
        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, width: width }}>
          {credentials
            .filter((credential) => credentialChecked[credential.id])
            .map((credential, credentialIndex) => (
              <List.Accordion
                key={credentialIndex}
                title={<Text className="text-sm font-pmedium">{credential.credential_name}</Text>}
                left={props => <Text {...props} className="text-sm font-pregular">{credentialIndex + 1}</Text>}
              >
                {purposes.map((purpose, purposeIndex) => {
                  const isHidden = links.some((link) =>
                    link.credential_id === credential.id && link.purpose_id !== purpose.id
                  )
                  return (
                    <List.Item
                      onPress={() => handlePurposeCheckbox(credential.id, purpose.id)}
                      key={purposeIndex}
                      title={<Text className="text-sm font-pmedium">{purpose.purpose_name}</Text>}
                      left={props => <Text {...props} className="text-sm font-pregular">{purposeIndex + 1}</Text>}
                      right={() => (
                        <Checkbox
                          status={purposeChecked[credential.id]?.[purpose.id] ? 'checked' : 'unchecked'}
                        />
                      )}
                      className={isHidden && 'hidden'}
                    />
                  )
                })}
              </List.Accordion>
            ))}
        </ScrollView>
      )
    },
    {
      key: 'slide3',
      component: (
        <ScrollView
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1, width: width }}
        >
          {credentials
            .filter((credential) => credentialChecked[credential.id])
            .map((credential, credentialIndex) => {
              const selectedPurposes = purposes.filter(
                (purpose) => purposeChecked[credential.id]?.[purpose.id]
              )
              const totalAmount = selectedPurposes.reduce((total, purpose) => {
                const credentialAmount = parseFloat(credential.amount)
                const quantity = credentialCount[credential.id]?.[purpose.id] || 1
                return total + credentialAmount * quantity
              }, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
              if (selectedPurposes.length > 0) {
                return (
                  <List.Accordion
                    key={credentialIndex}
                    title={<Text className="text-sm font-pmedium">{credential.credential_name}</Text>}
                    left={(props) => <Text {...props} className="text-sm font-pregular">{credentialIndex + 1}</Text>}
                  >
                    {credential.on_page === 'yes' && (
                      <View className="flex-row space-x-2">
                        <Ionicons name='alert-circle-outline' size={24} color="orange" />
                        <Text className="font-pregular text-sm pr-4">Note: There will be changes in the partial amount on the review as the admin adds pages.</Text>
                      </View>
                    )}
                    {selectedPurposes.map((purpose, purposeIndex) => (
                      <List.Item
                        key={purposeIndex}
                        title={<Text className="text-sm font-pmedium">{purpose.purpose_name}</Text>}
                        description={() => <Text className="text-sm font-pregular">Copy/s:</Text>}
                        left={(props) => <Text {...props} className="text-sm font-pregular">{purposeIndex + 1}</Text>}
                        right={(props) => (
                          <>
                            {links.some(link => link.credential_id === credential.id && link.purpose_id === purpose.id) ? (
                              <Text {...props} className="text-sm font-pregular">x 1</Text>
                            ) : (
                              <View {...props} className={`flex-row items-center`}>
                                <IconButton
                                  onPress={() =>
                                    handleQuantityChange(credential.id, purpose.id, -1)
                                  }
                                  mode="contained"
                                  icon={() => (
                                    <Ionicons name="remove" size={16} color="#1f2937" />
                                  )}
                                  style={{ height: 30, width: 30 }}
                                />
                                <Text className="text-sm font-pregular">
                                  {credentialCount[credential.id]?.[purpose.id] || 1}
                                </Text>
                                <IconButton
                                  onPress={() =>
                                    handleQuantityChange(credential.id, purpose.id, 1)
                                  }
                                  mode="contained"
                                  icon={() => (
                                    <Ionicons name="add" size={16} color="#1f2937" />
                                  )}
                                  style={{ height: 30, width: 30 }}
                                />
                              </View>
                            )}
                          </>
                        )}
                      />
                    ))}
                    <List.Item
                      left={props => <Text {...props} className="text-sm font-pregular">{credential.on_page === 'yes' ? 'Partial Amount:' : 'Total Amount:'}</Text>}
                      right={props => <Text {...props} className="text-sm font-pregular">₱ {totalAmount}</Text>}
                    />
                  </List.Accordion>
                )
              }
            })}
        </ScrollView>
      )
    }
  ]

  const renderScene = ({ item }) => item.component

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      setCurrentIndex(currentIndex + 1)
      slideIndex.current.scrollToIndex({ index: currentIndex + 1 })
    }
  }

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      slideIndex.current.scrollToIndex({ index: currentIndex - 1 })
    }
  }

  const isNextDisabled = currentIndex === 0
    ? Object.values(credentialChecked).every((checked) => !checked)
    : currentIndex === 1
      ? Object.keys(purposeChecked).length === 0
      : false

  return (
    <>
      <LoadingScreen visible={loading} />
      <View className="flex-1 bg-white">
        <View className="bg-white p-4 space-y-6">
          <View className="flex-row items-center justify-between space-x-2">
            {slides.map((item, index) => (
              <View key={index} className={`flex-1 h-[6px] rounded-full ${index <= currentIndex ? "bg-blue-500" : "bg-gray-300"}`}></View>
            ))}
          </View>
          <View className="space-y-2">
            <Text className="text-xl font-pbold">
              {currentIndex === 0 && 'Credentials'}
              {currentIndex === 1 && 'Purposes'}
              {currentIndex === 2 && 'Check Out'}
            </Text>
            <Text className="text-sm font-pregular">
              {currentIndex === 0 && 'Please select document/s.'}
              {currentIndex === 1 && 'Please select your purpose of request.'}
              {currentIndex === 2 && 'Review your request credentials.'}
            </Text>
          </View>
        </View>
        <FlatList
          ref={slideIndex}
          data={slides}
          horizontal
          pagingEnabled
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          renderItem={renderScene}
        />
        <View className={`flex-row items-center p-4 ${currentIndex > 0 ? 'justify-between' : 'justify-end'}`}>
          {currentIndex > 0 && (
            <IconButton
              onPress={handleBack}
              icon={() => <Ionicons name='arrow-back' size={30} />}
              mode="outlined"
              style={{ height: 60, width: 60 }}
            />
          )}
          <IconButton
            onPress={currentIndex <= 1 ? handleNext : handleCheckOut}
            icon={() => <Ionicons name={currentIndex <= 1 ? 'arrow-forward' : 'checkmark'} size={30} color="white" />}
            mode="contained"
            containerColor='#3b82f6'
            disabled={isNextDisabled}
            style={{ height: 60, width: 60 }}
          />
        </View>
      </View>
    </>
  )
}

export default Request