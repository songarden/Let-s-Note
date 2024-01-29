package com.geeks.letsnote.global.network.api;

import com.geeks.letsnote.domain.account.application.AccountService;
import com.geeks.letsnote.domain.account.dto.ResponseAccount;
import com.geeks.letsnote.domain.message.application.MessageService;
import com.geeks.letsnote.domain.message.dto.MessageReqeust;
import com.geeks.letsnote.domain.message.dto.MessageResponse;
import com.geeks.letsnote.global.network.dto.SocketRequest;
import com.geeks.letsnote.global.network.dto.SocketResponse;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;
import java.security.Principal;
import java.util.HashSet;
import java.util.Set;

@Controller
public class EditorSocketController {

	private final MessageService messageService;

	private final AccountService accountService;

    public EditorSocketController(MessageService messageService, AccountService accountService) {
        this.messageService = messageService;
        this.accountService = accountService;
    }


    @MessageMapping("/editor/coordinate")
	@SendTo("/topic/editor/coordinate")
	public SocketResponse.content coordinateInfo(SocketRequest.content content) throws Exception {
		return new SocketResponse.content(content.instrument(), content.x(), content.y());
	}

	@MessageMapping("/chat/sendMessage")
	@SendTo("/topic/chat/public")
	public SocketResponse.chat sendMessage(@Payload SocketRequest.chat chatMessage) {
		Long accountId = 1L;
		MessageReqeust.information messageInfo = MessageReqeust.information.builder()
				.spaceId("1")
				.accountId(accountId)
				.msgContent(chatMessage.msgContent())
				.build();
		MessageResponse.information result = messageService.createMessage(messageInfo);
		ResponseAccount.NickName nickName = accountService.getNicknameFromAccountId(chatMessage.accountId());
		return new SocketResponse.chat(chatMessage.accountId(), chatMessage.msgContent(), nickName.nickname());
	}

	@MessageMapping("/chat/addUser")
	@SendTo("/topic/chat/public")
	public SocketResponse.chat addUser(@Payload SocketRequest.chat chatMessage,
									   SimpMessageHeaderAccessor headerAccessor) {

		ResponseAccount.NickName nickName = accountService.getNicknameFromAccountId(chatMessage.accountId());
		headerAccessor.getSessionAttributes().put("username", nickName.nickname());
		return new SocketResponse.chat(chatMessage.accountId(), chatMessage.msgContent(), nickName.nickname());
	}


}