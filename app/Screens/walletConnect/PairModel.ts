import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import { Image } from 'react-native-elements';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Modal from 'react-native-modal';

// interface PairModalProps {
//   proposal: any; //ToDo: fix.
//   visible: boolean;
//   handleAccept: () => void;
//   handleDecline: () => void;
// }

/*
     @notice: Proposal Modal for initiating the pair()
     @params: proposal, visible, open, handleAccept

     Rendering
      1. ModalHeader
      2. Requested Permissions Text
      3. Chain + Methods + Events
      4. Accept/Reject Buttons
  */
       function Events({events}) {
        return (
          <View style={styles.methodsContainer}>
            <Text style={styles.methodEventsTitle}>Events</Text>
            <View style={styles.flexRowWrapped}>
              {events?.map((method, index) => (
                <Tag key={index} value={method} />
              ))}
            </View>
          </View>
        );
      }
       function AcceptRejectButton({
        accept,
        onPress,
      }) {
        const acceptButtonColor = accept
          ? ['#2BEE6C', '#1DC956']
          : ['#F25A67', '#F05142'];
      
        const buttonText = accept ? 'Accept' : 'Decline';
      
        return (
          <TouchableOpacity
            style={!accept ? styles.accept : null}
            onPress={() => onPress()}>
            {/* <LinearGradient colors={acceptButtonColor} style={styles.buttonContainer}> */}
              <Text style={styles.mainText}>{buttonText}</Text>
            {/* </LinearGradient> */}
          </TouchableOpacity>
        );
      }

      function ModalHeader({name, url, icon}) {
        return (
          <View style={styles.modalHeaderContainer}>
            <View style={styles.imageRowContainer}>
              <Image
                source={{
                  uri: icon,
                }}
                style={styles.WCLogoLeft}
              />
              {/* <Image
                style={styles.emojiContainer}
                source={require('../../assets/Emojications.png')}
              />
              <Image
                source={require('../../assets/WalletConnect.png')}
                style={styles.WCLogoRight}
              /> */}
            </View>
      
            <Text style={styles.dappTitle}>{name}</Text>
            <Text style={styles.wouldLikeToConnectText}>would like to connect</Text>
            <Text style={styles.urlText}>{url?.slice(8)}</Text>
          </View>
        );
      }

      
export function PairModal({
  proposal,
  visible,
  handleAccept,
  handleDecline,
}) {
    console.log("proposal",proposal)
  // Note: Current namespaces is for EIP155 only (i.e. methods, events, chains)
  const name = proposal?.params?.proposer?.metadata?.name;
  const url = proposal?.params?.proposer?.metadata.url;
  const methods = proposal?.params?.requiredNamespaces.eip155.methods;
  const events = proposal?.params?.requiredNamespaces.eip155.events;
  const chains = proposal?.params?.requiredNamespaces.eip155.chains;
  const icon = proposal?.params.proposer.metadata.icons[0];

  return (
    <Modal
      isVisible={visible}
      hideModalContentWhileAnimating
      backdropOpacity={0.6}>
      <View style={styles.container}>
        <View style={styles.modalContainer}>
          <ModalHeader name={name} url={url} icon={icon} />

          <View style={styles.divider} />
          <Text style={styles.permissionsText}>REQUESTED PERMISSIONS:</Text>

          <View style={styles.chainContainer}>
            <View style={styles.flexRowWrapped}>
              {chains?.map((chain, index) => {
                return (
                  <Tag key={index} value={chain.toUpperCase()} grey={true} />
                );
              })}
            </View>

            <Methods methods={methods} />
            <Events events={events} />
          </View>

          <View style={styles.flexRow}>
            <AcceptRejectButton
              accept={false}
              onPress={handleDecline}
            />
            <AcceptRejectButton accept={true} onPress={handleAccept} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
function Methods({methods}) {
    return (
      <View style={styles.methodsContainer}>
        <Text style={styles.methodEventsTitle}>Methods</Text>
        <View style={styles.flexRowWrapped}>
          {methods?.length &&
            methods?.map((method, index) => (
              <Tag key={index} value={method} />
            ))}
        </View>
      </View>
    );
  }
  function Tag({value, grey}) {
    return (
      <View style={[styles.tagContainer, grey && styles.greyTagContainer]}>
        <Text style={[styles.mainText, grey && styles.greyMainText]}>
          {value}
        </Text>
      </View>
    );
  }
const styles = StyleSheet.create({
    tagContainer: {
        backgroundColor: 'rgba(221, 241, 248, 1)',
        minHeight: 26,
        paddingHorizontal: 8,
        paddingTop: 4,
        borderRadius: 28,
        marginRight: 4,
        marginBottom: 8,
      },
      greyTagContainer: {
        backgroundColor: 'rgba(60, 60, 67, 0.33)',
      },
      mainText: {
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        color: 'rgba(0, 172, 229, 1)',
      },
      greyMainText: {
        color: 'rgba(255, 255, 255, 1)',
      },

  methodsContainer: {
    marginTop: 4,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  methodEventsTitle: {
    color: 'rgba(121, 134, 134, 1)',
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '600',
    paddingLeft: 6,
    paddingVertical: 4,
  },
  flexRowWrapped: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
    methodsContainer: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 8,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginBottom: 8,
      },
      methodEventsTitle: {
        color: 'rgba(121, 134, 134, 1)',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '600',
        paddingLeft: 6,
        paddingVertical: 4,
      },
      flexRowWrapped: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        alignItems: 'center',
      },
    accept: {
        marginRight: 20,
      },
      buttonContainer: {
        marginVertical: 16,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        height: 56,
        width: 160,
      },
      mainText: {
        fontSize: 20,
        lineHeight: 24,
        fontWeight: '600',
        color: 'white',
      },
      imageContainer: {
        width: 24,
        height: 24,
      },
    modalHeaderContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      },
      imageRowContainer: {
        display: 'flex',
        flexDirection: 'row',
      },
      WCLogoLeft: {
        width: 60,
        height: 60,
        borderRadius: 30,
        right: -30,
        top: -8,
        zIndex: 1,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      WCLogoRight: {
        width: 60,
        height: 60,
        borderRadius: 8,
        left: -30,
        top: -8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
      emojiContainer: {
        opacity: 0.8,
        width: 290,
        height: 44,
        borderRadius: 8,
        marginBottom: 8,
      },
      dappTitle: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: '700',
      },
      wouldLikeToConnectText: {
        fontSize: 22,
        lineHeight: 28,
        fontWeight: '400',
        opacity: 0.6,
      },
      urlText: {
        paddingTop: 8,
        color: 'rgba(60, 60, 67, 0.6)',
        fontSize: 13,
        lineHeight: 18,
        fontWeight: '500',
      },
      divider: {
        height: 1,
        width: '100%',
        backgroundColor: 'rgba(60, 60, 67, 0.36)',
        marginVertical: 16,
      },
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexRow: {
    flex: 1,
    flexDirection: 'row',
  },
  flexRowWrapped: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  modalContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 34,
    backgroundColor: 'rgba(242, 242, 247, 0.8)',
    width: '100%',
    paddingTop: 30,
    minHeight: '70%',
    position: 'absolute',
    bottom: 44,
  },
  permissionsText: {
    color: 'rgba(60, 60, 67, 0.6)',
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '400',
    paddingBottom: 8,
  },
  chainContainer: {
    width: '90%',
    padding: 10,
    borderRadius: 25,
    backgroundColor: 'rgba(80, 80, 89, 0.1)',
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: 'rgba(60, 60, 67, 0.36)',
    marginVertical: 16,
  },
});
