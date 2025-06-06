import { router, useLocalSearchParams } from 'expo-router'
import { useEffect, useState } from 'react'
import { Alert, RefreshControl, ScrollView, Text, View } from 'react-native'
import axios from '../../../../../../api/axios'
import { Banner, Button, Chip, Dialog, List, Portal, RadioButton, TextInput } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons'
import { useAuthContext } from '../../../../../../contexts/AuthContext'
import { LoadingScreen } from '../../../../../../components/Dialog'

const reasons = ['I changed my mind', 'Request made by mistake', 'Others']

const MyCredentialId = () => {
  const [request, setRequest] = useState({})
  const { id } = useLocalSearchParams()
  const [loading, setLoading] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(reasons[0])
  const [others, setOthers] = useState(null)
  const formatDate = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
  const formatDateTime = (date) => new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" })
  const [refreshing, setRefreshing] = useState(false)
  const [bannerVisible, setBannerVisible] = useState(true)
  const [studentLinks, setStudentLinks] = useState([])
  const { user } = useAuthContext()

  const handleOpen = async () => {
    setOpen(!open)
  }

  useEffect(() => {
    const loadRequest = async () => {
      setLoading(true)
      await getRequest()
      await getStudentLink()
      setLoading(false)
    }
    loadRequest()
  }, [])

  const getRequest = async () => {
    await axios.get('/student/get-request-detail', {
      params: { req_number: id }
    })
      .then(({ data }) => {
        setRequest(data)
      })
  }

  const getStudentLink = async () => {
    await axios.get('/credential/get-student-link')
      .then(({ data }) => {
        setStudentLinks(data)
      })
  }

  const calculateAmount = () => {
    const reqCred = request.request_credential
    const credentialAmount = parseFloat(reqCred?.credential_amount)
    const page = parseInt(reqCred?.page)

    const totalAmount = reqCred?.credential_purpose.reduce((subTotal, purpose) => {
      const quantity = parseInt(purpose.quantity)

      return subTotal + credentialAmount * quantity * page
    }, 0)

    return totalAmount
  }

  const handleCancel = async () => {
    setBtnLoading(true)
    await axios.post('/student/cancel-request', { req_number: id, message: value, credential_id: request.request_credential?.credential.id, others })
      .then(() => {
        handleOpen()
        getRequest()
        getStudentLink()
      })
      .finally(() => {
        setBtnLoading(false)
      })
  }

  const handleRequestClaim = async () => {
    Alert.alert('Confirmation!', "If you've requested a claim, please visit the Registrar's Office to collect your credentials.", [
      {
        text: 'Later',
        style: 'cancel',
      },
      {
        text: 'Okay', onPress: async () => {
          setBtnLoading(true)
          await axios.post('/student/request-claim', { id: request.id })
            .then(() => {
              getRequest()
            })
            .finally(() => {
              setBtnLoading(false)
            })
        }
      }
    ])
  }

  const handleRequestAgain = async () => {
    Alert.alert('Confirmation!', 'Are you sure you want to request again?', [
      {
        text: 'No',
        style: 'cancel',
      },
      {
        text: 'Yes', onPress: async () => {
          setBtnLoading(true)
          await axios.post('/student/request-again-credential', {
            req_id: request.id,
            credential_id: request.request_credential?.credential_id, amount: request.request_credential?.credential.amount, page: request.request_credential?.page,
            credPurpose: request.request_credential?.credential_purpose.map(credPurpose => ({
              purpose_id: credPurpose.purpose_id,
              quantity: credPurpose.quantity
            }))
          })
            .then(() => {
              router.back()
            })
            .finally(() => {
              setBtnLoading(false)
            })
        }
      }
    ])
  }

  function calculateEstimatedFinishDate(startDate, daysToAdd) {
    const holidays = [
      '01-01', // New Year's Day
      '04-09', // Araw ng Kagitingan
      '02-20', // Birthday ni bado
      '05-01', // Labor Day
      '06-12', // Independence Day
      '06-19', // Birthday ni kokoy
      '08-21', // Ninoy Aquino Day
      '10-08', // Birthday ni bogart
      '11-01', // All Saints' Day
      '11-02', // All Saints' Day
      '11-30', // Bonifacio Day
      '12-25', // Christmas Day
      '12-29', // Birthday ni lolay, bulay, lor, langlang, layx, bukag, lore
      '12-30', // Rizal Day
    ]

    let date = new Date(startDate)
    let addedDays = 0

    while (addedDays < daysToAdd) {
      date.setDate(date.getDate() + 1)

      const isWeekend = date.getDay() === 0 || date.getDay() === 6
      const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
      const isHoliday = holidays.includes(formattedDate)

      if (!isWeekend && !isHoliday) {
        addedDays++
      }
    }

    return date
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await getRequest()
    setRefreshing(false)
  }

  const isDisabled = studentLinks.some(
    (studentLink) =>
      studentLink.credential_id === request.request_credential?.credential.id && studentLink.student_id === user.student.id
  )

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-blue-100/50">
        <LoadingScreen visible={loading} />
      </View>
    )
  }

  return (
    <>
      <View className="flex-1">
        <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={{ flexGrow: 1, backgroundColor: "#DBEAFE80", padding: 8 }}>
          {
            (((request.request_status === 'review' && request.request_credential?.credential.on_page === 'yes') ||
              (request.request_status === 'pay' && !request.payment) ||
              (request.request_status === 'pay' && request.payment) ||
              request.request_credential?.request_credential_status === 'claim') && (
                <Banner
                  className={`bg-white rounded-xl shadow-none ${bannerVisible ? 'mb-2' : 'mb-0'}`}
                  visible={bannerVisible}
                  actions={[
                    {
                      label: <Text className="font-pregular text-sm">Close</Text>,
                      onPress: () => setBannerVisible(false)
                    }
                  ]}
                  icon={({ size }) => (
                    <Ionicons name='alert-circle-outline' size={size} color="orange" />
                  )}>
                  <Text className="font-pregular text-sm">
                    {(request.request_status === 'review' && request.request_credential?.credential.on_page === 'yes')
                      ? 'Note: There will be changes in the partial amount on the review as the admin adds pages.'
                      : (request.request_status === 'pay' && !request.payment)
                        ? "If payment is not completed, you will not be able to request again."
                        : (request.request_status === 'pay' && request.payment)
                          ? 'Note: Please wait, your request is being processed.'
                          : request.request_credential?.request_credential_status === 'claim'
                            ? 'Note: Please wait, your request is being released.'
                            : null}
                  </Text>
                </Banner>
              ))
          }
          <View className="space-y-2">
            <View>
              <View className={`p-4 rounded-t-xl flex-row items-center justify-between ${request.request_status === 'review' && 'bg-yellow-500' || request.request_status === 'pay' && 'bg-orange-500' || request.request_status === 'process' && 'bg-cyan-500' || request.request_status === 'receive' && 'bg-indigo-500' || request.request_status === 'complete' && 'bg-green-500' || request.request_status === 'cancel' && 'bg-red-500'}`}>
                <Text className="text-white font-pmedium text-sm">Request No.: {request.request_number}</Text>
                <Text className="text-white font-pmedium text-sm capitalize">{request.request_status === 'review' && 'To Review' || request.request_status === 'pay' && 'To Pay' || request.request_status === 'process' && 'In Process' || request.request_status === 'receive' && 'To Receive' || request.request_status === 'complete' && 'Completed' || request.request_status === 'cancel' && 'Cancelled'}</Text>
              </View>
              <View className="bg-white p-4 space-y-2 rounded-b-xl">
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-pregular">Date Requested:</Text>
                  <Text className="text-sm font-pregular">{formatDate(request.created_at)}</Text>
                </View>
                {request.request_status === 'cancel' && (
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-pregular">Date Cancelled:</Text>
                    <Text className="text-sm font-pregular">{formatDate(request.updated_at)}</Text>
                  </View>
                )}
                {request.request_status === 'complete' && (
                  <View className="flex-row items-center justify-between">
                    <Text className="text-sm font-pregular">Date Completed:</Text>
                    <Text className="text-sm font-pregular">{formatDate(request.updated_at)}</Text>
                  </View>
                )}
              </View>
            </View>
            {request.request_status === 'process' && (
              <View className="bg-white space-y-4 p-4 rounded-xl">
                <Text className="font-pmedium text-sm">Estimated Date to Claim</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-pregular">{formatDate(calculateEstimatedFinishDate(request.updated_at, parseInt(request.request_credential?.credential.working_day)))}</Text>
                </View>
              </View>
            )}
            <View className="bg-white rounded-xl pb-3">
              <View>
                <Text className="px-4 pt-4 pb-2 font-pmedium text-sm">Requested Credential</Text>
                <List.Item
                  title={() => <Text className="text-sm font-pregular">{request.request_credential?.credential.credential_name}</Text>}
                  description={() => <Text className="text-sm font-pregular">{`₱ ${request.request_credential?.credential_amount}`}</Text>}
                  right={props => <Text {...props} className="text-sm font-pregular">Page/s: {request.request_credential?.page}</Text>}
                  titleStyle={{ fontSize: 14 }}
                  className="py-0"
                >
                </List.Item>
              </View>
              <View>
                <Text className="px-4 pt-4 pb-2 font-pmedium text-sm">Selected Purpose/s</Text>
                {request.request_credential?.credential_purpose.map((credPurpose, index) => (
                  <List.Item
                    key={index}
                    title={() => <Text className="text-sm font-pregular">{credPurpose.purpose.purpose_name}</Text>}
                    description={() => <Text className="text-sm font-pregular">{`Copy/s: ${credPurpose.quantity}`}</Text>}
                    left={props => <Text {...props} className="text-sm font-pregular">{index + 1}</Text>}
                    titleStyle={{ fontSize: 14 }}
                    className="py-0"
                  >
                  </List.Item>
                ))}
              </View>
            </View>
            <View className="bg-white space-y-4 p-4 rounded-xl">
              <View className="flex-row items-center justify-between">
                <Text className="font-pmedium text-sm">Payment</Text>
                {request.payment && (
                  <Chip className="bg-green-500/20" textStyle={{ color: "#14532d" }}>
                    <Text className="text-sm font-pmedium">Paid</Text>
                  </Chip>
                )}
              </View>
              {request.payment && (
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-pregular">Date and Time:</Text>
                  <Text className="text-sm font-pregular">{formatDateTime(request.payment.created_at)}</Text>
                </View>
              )}
              {request.payment && (
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-pregular">OR Number:</Text>
                  <Text className="text-sm font-pregular">{request.payment.or_number}</Text>
                </View>
              )}
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-pregular">
                  {(request.request_status !== 'review' && request.request_status !== 'cancel') ? 'Total Amount:' : request.request_credential?.credential.on_page === 'yes' ? 'Partial Amount:' : 'Total Amount'}
                </Text>
                <Text className="text-sm font-pregular">₱ {calculateAmount()?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
              </View>
            </View>
            {request.request_status === 'cancel' && (
              <View className="bg-white space-y-4 p-4 rounded-xl">
                <Text className="font-pmedium text-sm">Reason</Text>
                <Text className="text-sm font-pregular">{request.message}</Text>
              </View>
            )}
          </View>
        </ScrollView>
        {request.request_status === 'review' && (
          <View className="bg-white p-2">
            <Button onPress={handleOpen} mode='outlined' textColor='red' contentStyle={{ height: 50 }} className="rounded-xl">
              <Text className="text-sm font-pmedium">Cancel Request</Text>
            </Button>
          </View>
        )}
        {(request.request_status === 'receive' && request.request_credential.request_credential_status === null) && (
          <View className="bg-white p-2">
            <Button onPress={handleRequestClaim} mode='outlined' contentStyle={{ height: 50 }} className="rounded-xl" disabled={btnLoading} loading={btnLoading}>
              <Text className="text-sm font-pmedium">Request Claim</Text>
            </Button>
          </View>
        )}
        {request.request_status === 'cancel' && (
          <View className="bg-white p-2">
            <Button onPress={handleRequestAgain} mode='outlined' contentStyle={{ height: 50 }} className="rounded-xl" disabled={isDisabled || btnLoading} loading={btnLoading}>
              <Text className="text-sm font-pmedium">Request Again</Text>
            </Button>
          </View>
        )}
      </View>

      <Portal>
        <Dialog visible={open} dismissable={false} className="bg-white rounded-xl">
          <Dialog.Title className="text-center font-pmedium">Confirmation Alert!</Dialog.Title>
          <Dialog.Content className="p-0">
            <Text className="px-4 font-pmedium text-sm mb-2">Choose a reason:</Text>
            <RadioButton.Group onValueChange={value => {
              setValue(value)
              setOthers(null)
            }} value={value}>
              {reasons.map((reason, index) => (
                <RadioButton.Item key={index} value={reason} label={reason} labelStyle={{ fontSize: 14, fontFamily: "Poppins-Regular" }} style={{ height: 40 }} disabled={btnLoading} />
              ))}
              {reasons[2] === value && (
                <TextInput label={<Text className="font-pregular text-sm">Type a reason</Text>} value={others} multiline onChangeText={(text) => setOthers(text)} contentStyle={{ fontFamily: "Poppins-Regular", fontSize: 14 }} />
              )}
            </RadioButton.Group>
          </Dialog.Content>
          <Dialog.Actions className="p-0">
            <View className="flex-row items-center space-x-2 p-4">
              <Button onPress={handleOpen} mode='text' textColor='black' className="rounded-xl" disabled={btnLoading}>
                <Text className="text-sm font-pmedium">Cancel</Text>
              </Button>
              <Button onPress={handleCancel} mode='text' className="rounded-xl" disabled={btnLoading} loading={btnLoading}>
                <Text className="text-sm font-pmedium">Submit</Text>
              </Button>
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  )
}

export default MyCredentialId