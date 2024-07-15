import React, { useEffect, useState } from 'react';
import { Descriptions, Divider, List, Button, Input, Select, Form, message, Image, DatePicker, Upload } from 'antd';
import { CheckOutlined, PlusOutlined, EditOutlined, UploadOutlined } from '@ant-design/icons';
import { getSingleOfficerResponseApi, getSingleOfficerResponsePublicApi, updateActivityStatusApi, updateOfficerResponseALreadyFilledApi, updateOfficerResponseApi } from '../services/apiConstants';
import { useNavigate, useParams } from 'react-router-dom';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Logo from "../assets/color-logo-black-text.png";
import PropertyImage from "../assets/property.jpg";

import ActivityLogo from "../assets/activity.png";

import { Document, Page, Text, Image as PdfImage, View, StyleSheet } from '@react-pdf/renderer';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { compressFile } from '../Utils/Image';

const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: ' 20px 20px 50px 20px',
      fontSize: 12,
      lineHeight: 1.5,
    },
    header: {
      display: 'flex',
      flexDirection:'column',
      gap:20,
  
      alignItems: 'flex-end',
    },
  
    firstRow: {
      height: 100,
      width: '100%',
      display: 'flex',
      flexDirection: 'row',
      gap: 20,
      alignItems: 'center',
      justifyContent:'space-between',
      padding: 10,
      borderRadius: 10,
      margin: '20px 0',
    },
    activityLogo: {
      height: 50,
      width: 50,
    },
    heading: {
      fontSize: 22,
    },
    secondSection: {
      margin: '20px 0',
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: '20px 10px',
      borderBottom: '1 solid #000',
      borderTop: '1 solid #000',
    },
    detailsColumn: {
      display: 'flex',
      flexDirection: 'column',
      gap: 5,
    },
    propertyImage: {
      height: 150,
      width: 150,
    },
    subHeader: {
      fontSize: 14,
      marginBottom: 5,
      textDecoration: 'underline',
    },
    text: {
      marginBottom: 5,
    },
    boldText: {
      fontWeight: 'bold',
      fontSize: 16,
    },
    column: {
      flexDirection: 'column',
      width: '45%',
    },
    table: {
      display: 'flex',
      flexDirection:'column',
      gap:10,
      width: 'auto',
      marginBottom: 10,
    },
    tableRow: {
  display:'flex',
  flexDirection:'row',
  alignItems:'center',
  justifyContent: 'space-between',
  borderBottom:'1px solid #e5e5e5'
    },
    tableCol: {
      width: '50%',
        },
    tableCell: {
      padding: 5,
    },
    photo: {
      marginBottom: 10,
      height: 150,
      width: 150
    },
    logo: {
      width: 50,
      height: 50,
      position: 'absolute',
      left: 30,
      bottom: 30,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderTop: '1px solid #EEE',
      padding: 10,
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
    },
    pageNumber: {
      fontSize: 8,
    },
    timestamp: {
      fontSize: 8,
    },
  });
export const ResponseOfficerReportPublic = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [submitLoading, setSubmitLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isResponseEditing, setIsResponseEditing] = useState(false);
    const [officerResponse, setOfficerResponse] = useState(data?.officerResponseAlreadyFilled);
    const [fileList, setFileList] = useState([]);
    const [responseFields, setResponseFields] = useState([]);
    const [officerPhotos, setOfficerPhotos] = useState([]);
    const [activity, setActivity] = useState({});
    const formData = activity;


    const currentDateTime = dayjs();


    const MyDocument = React.memo(({ activity, data, responseFields }) => (
        <Document>
          <Page wrap size="A4" style={styles.page}>
            <View style={styles.section}>
              <View style={styles.firstRow}>
                <PdfImage src={ActivityLogo} fixed alt="Activity Logo" style={styles.activityLogo} />
                <View style={styles.header}>
                  <Text style={styles.heading}>{`${activity.activityReferenceNumber} `}</Text>
                  <Text style={styles.heading}>{activity.activityType}</Text>
                </View>
              </View>
              <View style={styles.secondSection}>
                <View>
                  <PdfImage src={officerPhotos?.length > 0 ? officerPhotos[0]?.url : PropertyImage} crossOrigin="anonymous" fixed alt="Property" style={styles.propertyImage} />
                </View>
                <View style={styles.detailsColumn}>
                  <View style={styles.column}>
                    <Text style={styles.boldText}>Property Name</Text>
                    <Text style={styles.text}>{activity.propertyName}</Text>
                  </View>
                  <View style={styles.column}>
                    <Text style={styles.boldText}>Time On-Site</Text>
                    <Text style={styles.text}>{`${dayjs(activity.activityOnSiteDate).format('DD-MM-YYYY')} ${activity.activityOnSiteTime}`}</Text>
                  </View>
                  {activity.activityOffSiteDate && (
                    <View style={styles.column}>
                      <Text style={styles.boldText}>Time Off-Site</Text>
                      <Text style={styles.text}>{`${dayjs(activity.activityOffSiteDate).format('DD-MM-YYYY')} ${activity.activityOffSiteTime}`}</Text>
                    </View>
                  )}
                </View>
                <View style={styles.detailsColumn}>
                  <View style={styles.column}>
                    <Text style={styles.boldText}>Customer</Text>
                    <Text style={styles.text}>{activity.customerName}</Text>
                  </View>
                </View>
              </View>
            </View>
            {activity.activityOffSiteDate && ( <View style={styles.section} >
              <Text style={styles.subHeader}>On Site Location</Text>
              <View style={{ width: '100%', height: 300 }}>
                <PdfImage
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${activity?.offSitelat},${activity?.offSitelong}&zoom=14&size=600x300&markers=color:red%7C${activity?.onSitelat},${activity?.onSitelong}&key=AIzaSyAJO_o6CNuNJ_515prUWe_BkPDe0xdw4A0`}
                  style={{ width: '100%', height: '300px', margin: '20px 0' }}
                />
              </View>
            </View>)}
            <View style={styles.section} break>
              <Text style={styles.subHeader} >Off Site Location</Text>
              <View style={{ width: '100%', height: 300 }}>
                <PdfImage
                  src={`https://maps.googleapis.com/maps/api/staticmap?center=${activity?.onSitelat},${activity?.onSitelong}&zoom=14&size=600x300&markers=color:red%7C${activity?.onSitelat},${activity?.onSitelong}&key=AIzaSyAJO_o6CNuNJ_515prUWe_BkPDe0xdw4A0`}
                  style={{ width: '100%', height: '300px', margin: '20px 0' }}
                />
              </View>
            </View>
            <View style={styles.section} break>
              <Text style={styles.subHeader}>Activity Checks</Text>
              <View style={styles.table}>
                {responseFields.map((field, index) => (
                  <View key={index} style={styles.tableRow}>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{field.label}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{field.value}</Text>
                    </View>
                    </View>
    
                  ))}
            </View>
            </View>
    
            <View style={styles.section} break>
              <Text style={styles.subHeader}>Photos and Videos</Text>
              {officerPhotos && officerPhotos.length > 0 ? (
                officerPhotos.map((photo, index) => (
                  <PdfImage crossOrigin="anonymous" key={index} style={styles.photo} src={photo?.url} />
                ))
              ) : (
                <Text style={styles.text}>No photos or videos available</Text>
              )}
            </View>
            <View style={styles.footer} fixed>
             <View style={{display:'flex',gap:4,flexDirection:'row' ,alignItems:'center'}}>
             <Link src="https://rapto.uk/">
              <PdfImage src={Logo} fixed alt="Logo" style={{ width: 80 }} />
            </Link>        
             </View>
             <View style={{display:'flex',flexDirection:'column',alignItems:'flex-end'}}> <Text style={styles.timestamp}>{` ${dayjs().format('DD-MM-YYYY HH:mm A')}`}</Text>
              <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
                `Page : ${pageNumber} / ${totalPages}`
              )}  /></View>
            </View>
          </Page>
        </Document>
      ), (prevProps, nextProps) => {
        return (
          prevProps.activity === nextProps.activity &&
          prevProps.data === nextProps.data &&
          prevProps.responseFields === nextProps.responseFields &&
          prevProps.officerPhotos === nextProps.officerPhotos
        );
      });
      


    useEffect(() => {
        setOfficerResponse(data?.officerResponseAlreadyFilled);
    }, [data?.officerResponseAlreadyFilled]);

    const toggleFieldEditability = () => {
        setIsResponseEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        setOfficerResponse(e.target.value);
    };

    const saveChanges = async () => {
        setSubmitLoading(true); // Start the loader
        try {
            const newdata = {
                officerResponseData: {
                    officerResponseAlreadyFilled: officerResponse,
                    activityType: activity?.activityType,
                    activityId: activity?._id
                }
            };

            const fetchRows = await updateOfficerResponseALreadyFilledApi(newdata, data?._id);
            if (fetchRows.data.success) {
                message.success('Officer Response has been Added');
                updateActivityStatus(activity._id, 'Completed');
                navigate('/user-dashboard/all-activities');
            }
            setIsResponseEditing(false);
        } catch (error) {
            console.error('Error saving changes:', error);
            message.error('Failed to add officer response. Please try again.');
        } finally {
            setSubmitLoading(false); // Stop the loader
        }
    };


    const [form] = Form.useForm();
    const [long, setLong] = useState(null);
    const [propertyAIValue, setPropertyAIValue] = useState(null);
    const [propertyAIImages, setPropertyAIImages] = useState([]);

    const [lat, setLat] = useState(null);
    const [addresses, setAddresses] = useState({
        accepted: '',
        onTheWay: '',
        onSite: '',
    });
    const { reference } = useParams() // Extract id from URL


    useEffect(() => {
        if (data) {
            console.log("Data object: ", data);
            if (data.officerPhotos) {
                console.log("Officer Photos: ", data.officerPhotos);
                const photos = data.officerPhotos.map((url, index) => ({
                    uid: index.toString(),
                    name: `file-${index}`,
                    status: 'done',
                    url: url,
                    type: url.includes('.mp4') ? 'video/mp4' : 'image/*'
                }));
                setOfficerPhotos(photos);
            } else {
                console.log("Officer Photos is undefined or empty.");
            }
        } else {
            console.log("Data is undefined or null.");
        }
    }, [JSON.stringify(data)]);

    console.log('officerPhotos', officerPhotos)
    useEffect(() => {
        if (reference) {
            fetchData();

        }
        fetchAddresses();


    }, []);



    useEffect(() => {
        const fieldsToRemove = ["_id", "activityId", "officerPhotos", "officerVideos", "createdAt", "updatedAt", "__v"];

        function formatLabel(key) {
            return key
                .split('')
                .map((char, index) => (index > 0 && char === char.toUpperCase() ? ' ' + char : char))
                .join('')
                .replace(/^./, str => str.toUpperCase());
        }

        function formatValue(value) {
            if (value === 'yes' || value === 'no') {
                return value.charAt(0).toUpperCase() + value.slice(1);
            }
            if (value === 'na') {
                return 'N/A';
            }
            if (value === true) {
                return 'Yes';
            }
            if (value === false) {
                return 'No';
            }
            return value;
        }

        setResponseFields(
            Object.keys(data)
                .filter(key => !fieldsToRemove.includes(key))
                .map(key => ({
                    label: formatLabel(key),
                    value: formatValue(data[key]),
                    type: getInputType(data[key]),
                }))
        );

    }, [JSON.stringify(data)])

    const fetchData = async () => {
        const response = await getSingleOfficerResponsePublicApi({ activityData: { activityId: reference } });
        if (response.data.success) {
            setPropertyAIValue(response.data.propertyAI?.value);
            setPropertyAIImages(response.data.aiImages);

            setData(response.data.officerResponse);
            setActivity(response.data.activity)
            form.setFieldsValue({
                ...response.data.officerResponse,
                activityStartDate: dayjs(activity.activityStartDate),
                activityFinishDate: dayjs(activity.activityFinishDate),
                activityStartTime: dayjs(activity.activityStartTime),
                activityFinishTime: dayjs(activity.activityFinishTime),
                activityAcceptedDate: dayjs(activity.activityAcceptedDate),
                activityAcceptedTime: activity.activityAcceptedTime,
                activityOnTheWayDate: dayjs(activity.activityOnTheWayDate),
                activityOnTheWayTime: activity.activityOnTheWayTime,
                activityOnSiteDate: dayjs(activity.activityOnSiteDate),
                activityOnSiteTime: activity.activityOnSiteTime
            });
        }
    };

    const fetchAddresses = () => {
        fetchAddress(activity.onAcceptedlat, activity.onAcceptedLong, 'accepted');
        fetchAddress(activity.onTheWaylat, activity.onTheWayLong, 'onTheWay');
        fetchAddress(activity.onSitelat, activity.onSitelong, 'onSite');
    };

    const fetchAddress = async (lat, long, status) => {
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`;
        try {
            const response = await fetch(url, { headers: { 'User-Agent': 'request' } });
            const data = await response.json();
            setAddresses(prev => ({
                ...prev,
                [status]: data.display_name || 'Address not found'
            }));
        } catch (error) {
            console.error(`Error fetching ${status} address:`, error);
            setAddresses(prev => ({
                ...prev,
                [status]: 'Error fetching address'
            }));
        }
    };

    const getData = async () => {
        const fetchRows = await getSingleOfficerResponseApiPublic({ activityData: { activityId: reference } });
        if (fetchRows.data.success) {
            setData(fetchRows?.data?.officerResponse);
            setPropertyAIValue(fetchRows.data.propertyAI?.value);
            setPropertyAIImages(fetchRows.data.aiImages);
            form.setFieldsValue(fetchRows?.data?.officerResponse);
        }
    };

    useEffect(() => {
        getData();
    }, []);

    navigator.geolocation.getCurrentPosition(function (position) {
        getAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
    }, function (error) {
        console.error('Error Code = ' + error.code + ' - ' + error.message);
    });

    function getAddressFromCoordinates(latitude, longitude) {
        var url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

        fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3' }
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                } else {
                    console.log('Address not found');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    const updateActivityStatus = async (activityId, activityStatus, date, time) => {
        const activityData = {
            activityId, activityStatus, performedByUserId: userStoreState?._id,
            activityOffSiteDate: date,
            activityOffSiteTime: time,
            long: long,
            lat: lat,
        };
        const fetchRows = await updateActivityStatusApi({ activityData });
        if (fetchRows.data.success) {
            message.success('Activity status updated successfully');
        }
    };

    const userStoreState = JSON.parse(localStorage.getItem('user'));

    const onSiteOff = async () => {
        try {
            if (onSiteDateTime) {
                if (activity?.activityStatus == 'Submitted') {
                    await updateActivityStatus(formData._id, 'Off Site', onSiteDateTime.format('DD-MM-YYYY'), onSiteDateTime.format('HH:mm'));
                } else if (activity?.activityStatus == 'Off Site') {
                    await updateActivityStatus(formData._id, 'Completed', onSiteDateTime.format('DD-MM-YYYY'), onSiteDateTime.format('HH:mm'));
                }
                navigate('/user-dashboard/all-activities');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = async () => {
        try {
            const responseData = new FormData()
            const updatedData = form.getFieldsValue();
            const officerFiles = [];
            officerPhotos?.map(file => {

                if (file.originFileObj) {
                    // New file to be uploaded
                    responseData.append("photos", file.originFileObj);
                } else {

                    // Existing file URL
                    officerFiles?.push(file.url);
                }
            });
            console.log('officerFiles', officerFiles)
            updatedData.officerFiles = officerFiles;

            responseData.append(
                'officerResponseData',
                JSON.stringify(updatedData)
            )
            const fetchRows = await updateOfficerResponseApi(responseData, data?._id);
            if (fetchRows.data.success) {
                message.success('Officer response updated successfully');
                setIsEditing(false);
                getData();
            } else {
                message.error('Failed to update officer response');
            }
        } catch (error) {
            console.error(error);
            message.error('An error occurred while updating the officer response');
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        form.resetFields();
    };
    const [loading, setLoading] = useState(false);

    const isImage = url => /\.(jpg|jpeg|png|gif|bmp|svg)$/i.test(url);

    const isVideo = url => /\.(mp4|webm|ogg)$/i.test(url);

    const [onSiteDateTime, setOnSiteDateTime] = useState(dayjs());

    const handleDateChange = (value) => {
        setOnSiteDateTime(value);
    };

    const handleofficerPhotosChange = async (info) => {
        const newFileList = await Promise.all(
            info.fileList.map(async (file) => {
                if (file.originFileObj) {
                    const compressedFile = await compressFile(file.originFileObj);
                    return {
                        ...file,
                        originFileObj: compressedFile.originFileObj,
                        url: compressedFile.url,
                    };
                }
                return file;
            })
        );
        setOfficerPhotos(newFileList);
    };

    const handleUploadChange = ({ fileList }) => {
        setFileList(fileList);
    };

    const handleUploadRemove = (file) => {
        setFileList(fileList.filter(item => item.uid !== file.uid));
    };

    const handleRemoveImage = (index) => {
        const updatedPhotos = data?.officerPhotos?.filter((_, i) => i !== index);
        setData({ ...data, officerPhotos: updatedPhotos });
    };

    console.log('responseFields', responseFields)

    const getInputType = value => {
        if (value === 'yes' || value === 'no' || value === 'na') {
            return 'select';
        }
        // if (typeof value === 'string' && !isNaN(Date.parse(value))) {
        //   return 'datetime';
        // }
        if (typeof value === 'number' || typeof value === 'string') {
            return 'text';
        }
        return 'text';
    };


    const renderField = (field, isEditing) => {
        if (!isEditing) {
            return field.value;
        }

        switch (field.type) {
            case 'select':
                return (
                    <Form.Item name={field?.label.charAt(0).toLowerCase() + field?.label.slice(1).replace(/\s+/g, '')} initialValue={String(field.value)}>
                        <Select>
                            <Select.Option value="yes">Yes</Select.Option>
                            <Select.Option value="no">No</Select.Option>
                            <Select.Option value="na">N/A</Select.Option>
                        </Select>
                    </Form.Item>
                );
            case 'text':
                return (
                    <Form.Item name={field?.label.charAt(0).toLowerCase() + field?.label.slice(1).replace(/\s+/g, '')} initialValue={field.value}>
                        <Input />
                    </Form.Item>
                );
            case 'datetime':
                return (
                    <Form.Item name={field?.label.charAt(0).toLowerCase() + field?.label.slice(1).replace(/\s+/g, '')} initialValue={dayjs(field.value)}>
                        <DatePicker showTime />
                    </Form.Item>
                );
            default:
                return field.value;
        }
    };

    return (
        <div className='p-10'>
            {isEditing ? (
                <div className='flex gap-2 items-center w-full flex-col md:flex-row justify-end my-10'>
                    <Button type='primary' size='large' onClick={handleSave}>
                        Save
                    </Button>
                    <Button type='default' size='large' onClick={handleCancel}>
                        Cancel
                    </Button>
                </div>
            ) : (
                (!data?.officerResponseAlreadyFilled && <div className='flex gap-2 md:items-center flex-col md:flex-row items-start w-full justify-end my-10'>

                    <PDFDownloadLink
                        document={<MyDocument activity={activity} data={data} responseFields={responseFields} />}
                        fileName="report.pdf"
                    >
                        {({ loading }) =>
                            <Button disabled={loading} size='large' type="primary">Export to PDF</Button>
                        }
                    </PDFDownloadLink>        </div>)
            )}
            <div className='my-5' id="pdf-content">
                <Form className='' form={form} layout='vertical'>

                    <div>
                    </div>
                    {!data?.officerResponseAlreadyFilled ? <p className='text-lg font-medium my-4  flex items-center gap-4'>Instructions: <p className='text-base font-normal'> {activity?.activityAdditionalInstructions}</p></p> : ''}

                    {!data?.officerResponseAlreadyFilled ?
                        <div className='m-5' id="pdf-content">


                            <Descriptions bordered >
                                <Descriptions.Item label="Accepted Date and Time">
                                    {`${dayjs(activity.activityAcceptedDate).format("DD-MM-YYYY")} at ${activity.activityAcceptedTime}`}
                                </Descriptions.Item>
                                <Descriptions.Item label="Enroute Date and Time">
                                    {`${dayjs(activity.activityOnTheWayDate).format("DD-MM-YYYY")} at ${activity.activityOnTheWayTime}`}
                                </Descriptions.Item>
                                <Descriptions.Item label="On Site Date and Time">
                                    {`${dayjs(activity.activityOnSiteDate).format("DD-MM-YYYY")} at ${activity.activityOnSiteTime}`}
                                </Descriptions.Item>
                                <Descriptions.Item label="Activity Start Date">
                                    {dayjs(activity.activityStartDate).format("DD-MM-YYYY")}
                                </Descriptions.Item>
                                <Descriptions.Item label="Activity Finish Date">
                                    {dayjs(activity.activityFinishDate).format("DD-MM-YYYY")}
                                </Descriptions.Item>
                                <Descriptions.Item label="Location on Accepted">{`${Number(activity.onAcceptedlat)?.toFixed(2)},${Number(activity.onAcceptedLong)?.toFixed(2)}`}</Descriptions.Item>
                                <Descriptions.Item label="Location Enroute">
                                    {`${Number(activity.onTheWaylat)?.toFixed(2)},${Number(activity.onTheWayLong)?.toFixed(2)}`}
                                </Descriptions.Item>
                                <Descriptions.Item label="Location on Site">
                                    {`${Number(activity.onSitelat)?.toFixed(2)},${Number(activity.onSitelong)?.toFixed(2)}`}
                                </Descriptions.Item>
                                <Descriptions.Item label='Branch Name'>
                                    {activity?.branchName}
                                </Descriptions.Item>
                                <Descriptions.Item label='Property Name'>
                                    {activity?.propertyName}
                                </Descriptions.Item>
                                <Descriptions.Item label='Property AI'>
                                    {propertyAIValue ? propertyAIValue : '-'}
                                </Descriptions.Item>
                                <Descriptions.Item label='Customer Name'>
                                    {activity?.customerName}
                                </Descriptions.Item>
                                <Descriptions.Item label='Time on Site'>
                                    {activity?.activityOnSiteTime}
                                </Descriptions.Item>
                                <Descriptions.Item label='Time off Site'>
                                    {activity?.activityOffSiteTime}
                                </Descriptions.Item>
                                {responseFields.map(field => (
                                    <Descriptions.Item key={field.label} label={field.label}>
                                        {renderField(field, isEditing)}
                                    </Descriptions.Item>
                                ))}
                            </Descriptions>
                            {propertyAIImages?.length > 0  && <Divider>AI Images</Divider>}
{propertyAIImages?.length > 0 &&  <Image.PreviewGroup>
                                        {propertyAIImages?.map((item, index) => (
                                            <div key={index} className='relative'>
                                                {isImage(item) ? (
                                                    <Image width={100} height={100} src={item} />
                                                ) : (
                                                    <video width={100} height={100} controls>
                                                        <source src={item} type='video/mp4' />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                )}
                                            </div>
                                        ))}
                                    </Image.PreviewGroup>}

                            {!data?.officerResponseAlreadyFilled && <Divider>Photos and Videos</Divider>}
                            {!data?.officerResponseAlreadyFilled && <div className='flex items-center gap-5'>
                                {isEditing ? (
                                    <Upload
                                        accept="image/*,video/mp4"
                                        fileList={officerPhotos}
                                        beforeUpload={() => false}
                                        onChange={handleofficerPhotosChange}
                                        onRemove={(file) => {
                                            const newFileList = officerPhotos.filter(item => item.uid !== file.uid);
                                            setOfficerPhotos(newFileList);
                                        }}
                                        multiple
                                        listType="picture-card"
                                    >
                                        <div>
                                            <PlusOutlined /> Upload
                                        </div>
                                    </Upload>
                                ) : (
                                    <Image.PreviewGroup>
                                        {data?.officerPhotos?.map((item, index) => (
                                            <div key={index} className='relative'>
                                                {isImage(item) ? (
                                                    <Image width={100} height={100} src={item} />
                                                ) : (
                                                    <video width={100} height={100} controls>
                                                        <source src={item} type='video/mp4' />
                                                        Your browser does not support the video tag.
                                                    </video>
                                                )}
                                            </div>
                                        ))}
                                    </Image.PreviewGroup>
                                )}
                            </div>}
                        </div> : <div className='text-lg font-medium my-4 flex items-center gap-4'>
                            {isResponseEditing ? (
                                <div className='flex gap-4'>
                                    <Input.TextArea
                                        type="text"
                                        value={officerResponse}
                                        onChange={handleInputChange}
                                        autoFocus
                                    />
                                    <Button
                                        disabled={officerResponse?.length < 1}
                                        type='primary'
                                        onClick={() => {
                                            saveChanges()
                                        }}
                                        loading={submitLoading}
                                    >
                                        Submit
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    Where he filled: {officerResponse}
                                    <EditOutlined
                                        style={{ marginLeft: "5px", cursor: "pointer" }}
                                        onClick={toggleFieldEditability}
                                    />
                                </>
                            )}
                        </div>}
                </Form>


            </div>
            {(activity?.activityStatus && activity?.activityStatus !== 'Completed') && (
                <div className='flex gap-2 items-center my-5'><Button type='primary' size='large' onClick={onSiteOff}>
                    {activity?.activityStatus == 'Submitted' ? 'Off Site' : 'Mark as done'}        </Button>
                    <DatePicker
                        defaultValue={currentDateTime}
                        placeholder='Enter time and date'
                        showTime
                        size='large'
                        onChange={handleDateChange}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                    />
                </div>
            )}

        </div>
    );
};

export default ResponseOfficerReportPublic;

