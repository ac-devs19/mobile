import { Ionicons } from '@expo/vector-icons'
import { Text, ScrollView, Image, Alert, RefreshControl } from 'react-native'
import { List } from 'react-native-paper'
import FileSuccess from '../../../../assets/images/file-success.png'
import FileWarning from '../../../../assets/images/file-warning.png'
import FileDanger from '../../../../assets/images/file-danger.png'
import FileEmpty from '../../../../assets/images/file-empty.png'
import { useState } from 'react'
import axios from '../../../../api/axios'
import { router, useFocusEffect } from 'expo-router'
import { setName } from '../../../../components/Name'
import { LoadingScreen } from '../../../../components/Dialog'
import { useCallback } from 'react'

const MyDocument = () => {
  const [documents, setDocuments] = useState([])
  const [submits, setSubmits] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useFocusEffect(
    useCallback(() => {
      const loadRequirement = async () => {
        setLoading(true)
        await getRequirement()
        setLoading(false)
      }
      loadRequirement()
    }, [])
  )

  const getRequirement = async () => {
    await axios.get('/student/get-requirement')
      .then(({ data }) => {
        setDocuments(data.documents)
        setSubmits(data.submits)
      })
  }

  const enableDate = () => {
    const now = new Date()
    const day = now.getDay()
    const hour = now.getHours()

    const isWeekday = day >= 1 && day <= 5
    const isBusinessHours = hour >= 8 && hour < 17

    return isWeekday && isBusinessHours
  }

  const onRefresh = async () => {
    setRefreshing(true)
    await getRequirement()
    setRefreshing(false)
  }

  return (
    <>
      <LoadingScreen visible={loading} />
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} contentContainerStyle={{ flexGrow: 1, backgroundColor: "#DBEAFE80", padding: 16, gap: 16 }}>
        {documents.map((document, index) => {
          const getRecord = new Map()
          submits.forEach(submit => {
            submit.record.forEach(record => {
              getRecord.set(record.document_id, submit.submit_status)
            })
          })

          const hasRecord = getRecord.get(document.id)

          let documentImage = FileEmpty

          if (hasRecord === 'confirm') {
            documentImage = FileSuccess
          } else if (hasRecord === 'review') {
            documentImage = FileWarning
          } else if (hasRecord === 'resubmit') {
            documentImage = FileDanger
          }

          return (
            <List.Item
              onPress={() => {
                // if (enableDate()) {
                //   router.navigate(`/home/my-document/${document.id}`)
                //   setName(document.document_name)
                // } else {
                //   if (!hasRecord) {
                //     Alert.alert('Note!', 'You can submit your document/s on weekdays between 8 AM to 5 PM')
                //   } else {
                //     router.navigate(`/home/my-document/${document.id}`)
                //     setName(document.document_name)
                //   }
                // }
                router.navigate(`/home/my-document/${document.id}`)
                setName(document.document_name)
              }}
              key={index}
              title={() => <Text className="text-sm font-pmedium">{document.document_name}</Text>}
              description={() => <Text className={`text-xs ${hasRecord ? 'font-pmedium' : 'font-pregular'} ${hasRecord === 'review' && 'text-yellow-500' || hasRecord === 'resubmit' && 'text-red-500' || hasRecord === 'confirm' && 'text-green-500'}`}>{hasRecord ? hasRecord === 'review' && 'To Review' || hasRecord === 'resubmit' && 'Resubmit' || hasRecord === 'confirm' && 'Confirmed' : 'Please submit your document/s'}</Text>}
              left={props => <Image {...props} source={documentImage} resizeMode='contain' className="w-14 h-14" />}
              right={props => <Ionicons {...props} name='chevron-forward-outline' size={20} />}
              borderless
              className="bg-white rounded-xl"
            />
          )
        })}
      </ScrollView>
    </>
  )
}

export default MyDocument